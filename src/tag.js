import tags from "./taglist.json";

const isString = x => typeof x === 'string' || x instanceof String;
const isRawObject = x => x && x.constructor === Object;
const isNode = x => x instanceof HTMLElement;
const isArrayLike = x => !isString(x) && Symbol.iterator in Object(x);
const isNothing = x => !x && x !== 0;
const isRenderable = x => !isRawObject(x) && !isNothing(x);

const liftElement = el => isNode(el) ? el : document.createTextNode(el);

const intercalateSpaces = els => els.reduce((acc, b) => (
    acc.concat((acc.length ? [' '] : []).concat(b))
), []);

const parseClasses = classes => {
    if (isArrayLike(classes)) {
        return Array.from(classes).map(parseClasses).join(' ');
    } else if (isRawObject(classes)) {
        return parseClasses(Object.keys(classes).filter(c => classes[c]));
    } else return classes || "";
}

const setAttributes = (el, {
    style, id, class: class_, className, ...attrs
}) => {
    className = className || class_;
    if (className) el.className = parseClasses(className || class_);
    if (id) el.id = id;
    if (isString(style)) el.style = style;
    else if (style) Object.assign(el.style, style);
    Object.entries(attrs).forEach(([attr, value]) =>
        el.setAttribute(attr, value)
    );
}

const buildTag = tag => (...args) => {
    const element = document.createElement(tag);
    let attributes = args.find(isRawObject);
    let children = intercalateSpaces(args.filter(isRenderable));

    children.forEach(el => element.appendChild(liftElement(el)));
    if (attributes) setAttributes(element, attributes);
    return element;
};

tags.forEach(tag => {
    window[tag] = buildTag(tag);
});

const tag = (tagName, ...args) => buildTag(tagName)(...args);
tag.prepare = buildTag;

const elementToString = el => {
    if (isNode(el)) return el.outerHTML;
    else return el.toString();
}

const buildTagString = tagName => (...args) => {
    // validate tag name
    document.createElement(tagName);

    let attributes = args.find(isRawObject);
    let body = intercalateSpaces(args.filter(isRenderable))
        .map(elementToString).join('');

    return buildTag('x')(attributes, 'y').outerHTML.replace(
        /<x([\s\S]*)>y<\/x>/,
        `<${ tagName }$1>${ body }</${ tagName }>`
    );
};

window.tagString = (tagName, ...args) => buildTagString(tagName)(...args);
tagString.prepare = buildTagString;

tagString.escape = str => str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default tag;