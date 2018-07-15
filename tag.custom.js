// Jonas Karg 2018

function tag() {
    let args = Array.from(arguments);
    if (args <= 0) {
        console.error(Error("(tag.custom.js):\nMissing arguments."));
        return null;
    }
    if (args[0].constructor !== String) {
        console.error(Error("(tag.custom.js):\nInvalid tag-name."));
        return null;
    }

    let element;
    let tag = args[0];
    if (/[^\w]+/g.test(tag)) {
        console.error(Error("(tag.custom.js):\nInvalid tag-name."));
        return null;
    };
    
    let elementArguments;
    let elementInnerHTML = "";
    let returnString;
    args.shift();

    args.map(arg => {
        if (arg.constructor === Boolean) returnString = arg;
        else if (arg.constructor === String || arg.constructor === Number) elementInnerHTML = String(arg);
        else if (arg.constructor === Object) elementArguments = arg;
    });

    if (returnString) {
        let elArgsConverted = "";
        if (elementArguments) elArgsConverted = " " + Object.entries(elementArguments).map(entry => `${entry[0]}="${entry[1]}"`).join(" ");
        element = `<${tag}${elArgsConverted}>${elementInnerHTML}</${tag}>`;
    } else {
        element = document.createElement(args[0]);
        element.innerHTML = elementInnerHTML || "";
        Object.entries(elementArguments || {}).map(entry => element.setAttribute(entry[0], entry[1]));
    }

    return element;
}