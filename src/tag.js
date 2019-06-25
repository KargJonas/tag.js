import tags from "./taglist.json";
import {
    isString,
    isRawObject,
    isNode,
    isArrayLike,
    // isNothing,
    isRenderable
} from "./typeChecking";

function liftElement(element) {
    if (isNode(element)) return element;
    return document.createTextNode(element);
}

function intercalateSpaces(elements) {
    return elements.reduce((accumulator, current) => (
        accumulator.concat((accumulator.length ? ["\n"] : []).concat(current))
    ), []);
}

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
        else if (value !== false) el.setAttribute(attribute, value);
    });
}

const buildTagNode = (tag) => (...args) => {
    const element = document.createElement(tag);
    let attributes = args.find(isRawObject);
    let children = intercalateSpaces(args.filter(isRenderable));

    children.forEach(el => element.appendChild(liftElement(el)));
    if (attributes) setAttributes(element, attributes);
    return element;
};

const elementToString = element =>
    isNode(element) ? element.outerHTML : element.toString();

const buildTagString = (tagName) => (...args) => {
    const innerHTML = intercalateSpaces(args.filter(isRenderable))
        .map(elementToString).join("");

    let attributes = args.find(isRawObject);

    const tagNameEscaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return buildTagNode(tagName)(attributes, "y").outerHTML.replace(
        RegExp(`>y</${tagNameEscaped}>$`,'i'),
        `>${innerHTML}</${tagName}>`,
    );
};

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
