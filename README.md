# tag.js
## tag.js is an extremely easy-to-use and lightweight HTML-creation library.

It allows you to use html-tag-names as functions.<br />
Each function accepts either zero or one string, boolean or object.<br />
If more than one of each datatype is passed into the function, the last one is used.
### Example:
```js
let myElement0 = h1("Hello world!", "My name is Bob.");
// myElement0 would be <h1>My name id Bob.<h1>
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