// Jonas Karg 2018
(() => {
    "use strict";
    const isBoolean = x => typeof x === "boolean" || x instanceof Boolean;
    const isString = x => typeof x === 'string' || x instanceof String;
    const isRawObject = x => x.constructor === Object;
    const isNode = x => x instanceof HTMLElement;
    const isArrayLike = x => !isString(x) && Symbol.iterator in Object(x);
    const isNothing = x => x === null || x === undefined;

    const liftElement = el => isNode(el) ? el : document.createTextNode(el);

    const tags = [
        "a", "abbr", "address", "area", "article", "aside", "audio",
        "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button",
        "canvas", "caption", "center", "cite", "code", "col", "colgroup",
        "command", "datalist", "dd", "del", "details", "dfn", "div", "dl",
        "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer",
        "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header",
        "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd",
        "label", "legend", "li", "link", "main", "map", "mark", "meta",
        "meter", "nav", "noscript", "object", "ol", "optgroup", "option",
        "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt",
        "ruby", "s", "samp", "script", "section", "select", "small", "source",
        "span", "strong", "style", "sub", "summary", "sup", "svg", "table",
        "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time",
        "title", "tr", "track", "u", "ul", "video", "wbr"
    ];

    const setAttributes = (el, {style, id, class: class_, className, ...attrs}) => {
        if (!className) className = class_;
        if (isArrayLike(className)) {
            className = Array.from(className).join(' ');
        }
        if (className) el.className = className;
        if (id) el.id = id;
        if (isString(style)) el.style=style;
        else if (style) Object.assign(el.style, style);
        Object.entries(attrs).forEach(([attr, value]) =>
            el.setAttribute(attr, value)
        );
    }

    tags.forEach(tag => {
        window[tag] = (...args) => {
            const element = document.createElement(tag);
            let attributes;
            let children = [];
            let returnString = false;

            args.forEach(arg => {
                if (isBoolean(arg)) returnString = arg;
                else if (isRawObject(arg)) attributes = arg;
                else if (isArrayLike(arg)) children = Array.from(arg);
                else if (!isNothing(arg)) children = [arg];
            });

            children.forEach(el => element.appendChild(liftElement(el)));
            if (attributes) setAttributes(element, attributes);

            if (returnString) return element.outerHTML;
            return element;
        }
    });
})();