
# tag.js
> `tag.js` is an extremely easy-to-use and lightweight HTML-creation library.

> `tag.custom.js` allows you to create non-standard HTML5-tags with non-standard attributes.

## `tag.js`

Allows you to use HTML-tag-names (all HTML5 tags including `<center>` and excluding `<var>`) as functions.  
Each function accepts either zero or one string, boolean or object.  
If more than one of each datatype is passed into the function, the last one is used.

## Example

```js
let myElement0 = h1("Hello world!", "My name is Bob.");
// myElement0 would be <h1>My name is Bob.<h1>
```

The string defines the innerHTML of the returned element, the object contains the attributes and the boolean tells the function whether to return a string instead of an element or not.  
The attributes can be arranged however you desire.  
Invalid attributes are ignored.

## This will generate a header containing the text "Hello World!"

```js
let myElement1 = h1("Hello world!");
```

## This will be a red paragraph containing the text "This is just a test.", followed by a link to Google

```js
let myElement2 = p({style: {color: "red"}}, [
    "This is just a test. ",
    a({href: "https://google.com"}, "Click here for Google")
]);
```

## In this case "myElement3" will be a string. Its content is going to be `<div class="a b c">It's pretty empty in here.</div>`

```js
let myElement3 = div({class: ['a','b', {c: true}]},
    "It's pretty empty in here.",
    true
);
```

## `tag.custom.js`

It's a little different with this one.  
instead of using one of the "html-tag-name-functions", a single `tag()` function is used to create all elements.  
The first argument has to be the tag-name of the element you want to create. Accept from that everything is the same as with tag.js.

### Example

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
