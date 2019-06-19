// Jonas Karg 2018
(() => {
    const isString = x => typeof x === 'string' || x instanceof String;
    const isNumber = x => typeof x === 'number' || x instanceof Number;
    const isBoolean = x => typeof x === 'boolean' || x instanceof Boolean;
    const isNode = x => x instanceof HTMLElement;
    const isIterable = x => Symbol.iterator in Object(x);

    const d = document;

    const liftElement = el => isNode(el) ? el : d.createTextNode(el);

    ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "video", "wbr"].map(tag => {
        window[tag] = (...args) => {
            const element = d.createElement(tag);
            let elementArguments;
            let elementChildren = [];
            let returnString = false;

            args.forEach(arg => {
                if (isBoolean(arg)) returnString = arg;
                else if (isNode(arg) || isString(arg) || isNumber(arg)) elementChildren = [arg];
                else if (isIterable(arg)) elementChildren = Array.from(arg);
                else if (arg.constructor === Object) elementArguments = arg;
            });

            elementChildren.forEach(el => element.appendChild(liftElement(el)));
            Object.assign(element, elementArguments || {});
            if (returnString) return element.outerHTML;
            return element;
        }
    });
})();