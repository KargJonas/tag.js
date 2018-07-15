## tag.js is an extremely easy-to-use and lightweight HTML-creation library.
## tag.custom.js allows you to create non-standard HTML5-tags with non-standard attributes.

# tag.js
Allows you to use HTML-tag-names (all HTML5 tags including `<center>` and excluding `<var>`) as functions.<br />
Each function accepts either zero or one string, boolean or object.<br />
If more than one of each datatype is passed into the function, the last one is used.
### Example:
```js
let myElement0 = h1("Hello world!", "My name is Bob.");
// myElement0 would be <h1>My name is Bob.<h1>
```

The string defines the innerHTML of the returned element, the object contains the attributes and the boolean tells the function wether to return a string instead of an element or not.<br />
The attributes can be arranged however you desire.<br />
Invalid attributes are ignored.

### This will generate a header with an innerHTML of "Hello World!"
```js
let myElement1 = h1("Hello world!");
```

### This will be a red paragraph with an innerHTML of "This is just a test."
```js
let myElement2 = p(
    {"style": "color: #f00"},
    "This is just a test."
);
```

### In this case "myElement3" will be a string. It's content is going to be: "<div>Its pretty empty in here..</div>"
```js
let myElement3 = div(
    "Its pretty empty in here..",
    true
);
```

#tag.custom.js
It's a little different with this one.<br />
instead of using one of the "html-tag-name-functions", a single `tag()` function is used to create all elements.<br />
The first argument has to be the tag-name of the element you want to create. Accept from that everything is the same as with tag.js .

###Example:
```js
let myVariable = 10;

let myElement4 = tag(
    "myCustomHtmlTag",  // camelcase is preserved when returned as string.
    "This is the elements' innerHTML.",
    {
        "style": "color: green",
        "myCustomProperty": myVariable
    },
    true
);
```
