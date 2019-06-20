(() => {
    "use strict";
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
        if (isString(style)) el.style=style;
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

    window.tag = (tagName, ...args) => buildTag(tagName)(...args);

    window.tag.prepare = buildTag;

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
            `<${tagName}$1>${body}</${tagName}>`
        );
    };
    window.tagString = (tagName, ...args) => buildTagString(tagName)(...args);
    window.tagString.prepare = buildTagString;

    tagString.escape = str => str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
})();