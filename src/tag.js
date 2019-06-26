import tags from "./taglist.json";
import {
  isString,
  isRawObject,
  isNode,
  isArrayLike,
  isNothing,
  isRenderable
} from "./typeChecking";

/**
 * Prepare something for addition to the DOM. If it is already a node, this
 * has no effect, otherwise it is converted to a text node.
 * 
 * @param {any} element Either a node or something to be converted to string.
 * @returns {Node} either a TextNode or the original element.
 */
function liftElement(element) {
  if (isNode(element)) return element;
  return document.createTextNode(element);
}

/**
 * Add whitespace between every element in the `elements` array, flattening
 * sub-arrays by one level. e.g. `intercalateSpaces(['a','b'])` gives
 * `['a','\n','b']`, and `intercalateSpaces([['a','b'],'c'])` gives
 * `['a','b','\n','c']`.
 * @param {any[]} elements An array of single elements or arrays
 * @returns {any[]} `elements`, flattened by one level, with a string of a
 *   newline character between top-level elements of the original array.
 */
function intercalateSpaces(elements) {
  return elements.reduce((accumulator, current) => (
    accumulator.concat((accumulator.length ? ["\n"] : []).concat(current))
  ), []);
}

/**
 * Generate the class list for an element, supporting (an array of) strings
 * and objects of booleans.
 * @typedef {string | {[className: string]: Boolean}} ClassDefinition
 * @param {ClassDefinition | ClassDefinition[]} classes
 * @returns {string} a space-separated list of classes.
 */
function parseClasses(classes) {
  if (isArrayLike(classes)) {
    return Array.from(classes).map(parseClasses).join(" ");
  } else if (isRawObject(classes)) {
    return parseClasses(Object.keys(classes).filter(c => classes[c]));
  } else return classes || "";
}

function setAttributes(el, {
  style, id, class: class_, className, ...attributes
}) {
  className = className || class_;
  if (className) el.className = parseClasses(className);
  if (id) el.id = id;
  if (isString(style)) el.style = style;
  else if (style) Object.assign(el.style, style);

  Object.entries(attributes).forEach(([attribute, value]) => {
    if (value instanceof Function) el[attribute] = value;
    else if (value === true) el.setAttribute(attribute, attribute);
    else if (isNothing(value)) el.setAttribute(attribute, value);
  });
}

/**
 * Create a function to turns a list of children into an `Element`.
 * @param {string} tag The tag name
 * @returns {(...args: (Node | string)[]) => Node}
 */
const buildTagNode = (tag) => (...args) => {
  const element = document.createElement(tag);
  let attributes = args.find(isRawObject);
  let children = intercalateSpaces(args.filter(isRenderable));

  children.forEach(el => element.appendChild(liftElement(el)));
  if (attributes) setAttributes(element, attributes);
  return element;
};

/**
 * Convert an element to a string, or passing through strings. This does not
 * cause the string to be escaped.
 * @param {element | string} tag The tag name
 * @returns {string}
 */
const elementToString = element =>
  isNode(element) ? element.outerHTML : element.toString();

/**
 * Create a function to turns a list of children into a string representation
 * of an HTML element.
 * @param {string} tag The tag name
 * @returns {(...args: (Node | string)[]) => Node}
 */
const buildTagString = (tagName) => (...args) => {
  const innerHTML = intercalateSpaces(args.filter(isRenderable))
    .map(elementToString).join("");

  let attributes = args.find(isRawObject);

  const tagNameEscaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return buildTagNode(tagName)(attributes, "y").outerHTML.replace(
    RegExp(`>y</${tagNameEscaped}>$`,'i'),
    `>${innerHTML}</${tagName}>`,
  ).replace(RegExp(`^<${tagNameEscaped}`,'i'), `<${tagName}`);
};

/**
 * Add properties and other handlers to a function.
 *
 * @param {Function} f A function to apply properties and generic overloads to
 * @param {Object} props An object of properties to set on the function.
 * @param {ProxyHandler} handler A handler for other accesses to the function,
 *   such as for getting unused properties
 * @returns {Proxy<any>} The proxied function with the properties defined. If
 *   the browser does not support proxying then the original function with the
 *   properties defined will be returned.
 */
function Overload(f, props = {}, handler) {
  const obj = Object.freeze(Object.assign(f, props));
  return Proxy && handler ? new Proxy(obj, handler) : obj;
}

const buildTag = tag => Overload(buildTagNode(tag), {
  string: buildTagString(tag),
});

const getAsPrepare = {
  get(target, prop) {
    if (prop in target) return target[prop];
    return target.prepare(prop);
  },
  has() { return true },
};

export default Overload((t, ...args) => buildTag(t)(...args), {
  prepare: buildTag,
  string: Overload((t, ...args) => buildTagString(t)(...args), {
    prepare: buildTagString,
    escape: str => str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/"/g, "&#039;"),
  }, getAsPrepare),
}, getAsPrepare);

if (window) for (let t of tags) {
  window[t] = buildTag(t);
}
