// Jonas Karg 2018

["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "video", "wbr"].map(tag => {
    window[tag] = function () {
        let element = document.createElement(tag);
        let elementArguments;
        let elementInnerHTML;
        let returnString;

        Array.from(arguments).map(arg => {
            if (arg.constructor === Boolean) returnString = arg;
            else if (arg.constructor === String || arg.constructor === Number) elementInnerHTML = String(arg);
            else if (arg.constructor === Object) elementArguments = arg;
        });

        element.innerHTML = elementInnerHTML || "";
        Object.assign(element, elementArguments || {});
        if (returnString) return element.outerHTML;
        return element;
    }
});