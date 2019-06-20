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
        accumulator.concat((accumulator.length ? [" "] : []).concat(current))
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
    if (className) el.className = parseClasses(className || class_);
    if (id) el.id = id;
    if (isString(style)) el.style = style;
    else if (style) Object.assign(el.style, style);

    Object.entries(attributes).forEach(([attribute, value]) =>
        el.setAttribute(attribute, value)
    );
}

const buildTag = (tag) => (...args) => {
    const element = document.createElement(tag);
    let attributes = args.find(isRawObject);
    let children = intercalateSpaces(args.filter(isRenderable));

    children.forEach(el => element.appendChild(liftElement(el)));
    if (attributes) setAttributes(element, attributes);
    return element;
};

for (let tag of tags) {
    window[tag] = buildTag(tag)
}

function tag(tagName, ...args) {
    return buildTag(tagName)(...args);
}

tag.prepare = buildTag;

function elementToString(element) {
    if (isNode(element)) return element.outerHTML;
    else return element.toString();
}

const buildTagString = (tagName) => (...args) => {
    const innerHTML = intercalateSpaces(args.filter(isRenderable))
        .map(elementToString).join("");

    let attributes = args.find(isRawObject);

    if (attributes) {
        attributes = Object
        .keys(attributes)
        .map((key) => {
            const name = key;
            const value = attributes[key];

            if (value) return `${name}="${value}"`;
            return name;
        }).join(" ");

        return `<${ tagName } ${ attributes }>${ innerHTML }</${ tagName }>`;
    }

    return `<${ tagName }>${ innerHTML }</${ tagName }>`;
};

tag.string = function (tagName, ...args) {
    return buildTagString(tagName)(...args);
};

tag.string.prepare = buildTagString;
tag.string.escape = (str) => str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/"/g, "&#039;");

export default tag;