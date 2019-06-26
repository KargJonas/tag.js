
# tag.js

`tag.js` is an extremely easy-to-use and lightweight HTML-creation library. It allows you to use HTML tag names (all HTML5 tags including `<center>` and excluding `<var>`) as functions. Each function takes a list of elements as children, and optionally an object of attributes.

If more than one object of attributes is passed into the function, the first is used and subsequent attributes are ignored.

## Examples

A single string will be rendered as the text content.

```js
    h4("Hello world!");
    // => <h4>Hello World</h4>
```

> <h4>Hello world!</h4>

---

Attributes can be given by a object. Multiple children can be provided, which can be other elements.

```js
p({style: {color: "red"}},
    "This is just a test.",
    a({href: "https://google.com"}, "Click here for Google")
);

// => <p style="color: red">
//      This is just a test.
//      <a href="https://google.com">Click here for Google</a>
//    </p>

```

Note that whitespace will be automatically inserted between arguments. To avoid this, wrap the elements to be rendered consecutively in an array.

```js
p(["This becomes italic mid-",em("word"),"!"]);

// => <p>This becomes italic mid-<em>word</em>!</p>
```

> <p>This becomes italic mid-<em>word</em>!</p>

---

Falsy values (except zero) will not be rendered, so `&&` can be used to optionally render a child.

```js
p('It is', !friday && 'not', 'Friday today');

// If `friday` is true:
//   => <p>It is Friday today</p>
// otherwise
//   => <p>It is not Friday today</p>
```

Either
> <p>It is Friday today</p>
or
> <p>It is not Friday today</p>

---

What about if we want to dynamically choose the name of the tag, or use a custom or otherwise unsupported tag? That's where the `tag()` function comes in. It works exactly like the functions for the specific elements above, except with an additional first argument for the tag name.

Note that this is case-insensitive, and the browser will discard any case information. The name is allowed to contain any characters allowed in JavaScript variable names, and dots and hyphens too (except at the start).

```js
tag('var', 'x');

// => <var>x</var>
```

> <var>x</var>

---

If you're going to be using a custom/unsupported tag frequently, you can bind it to a variable with `tag.prepare()`, or with `tag[]` (this latter form is not supported in Internet Explorer, and does not work with tags called `"call"`, `"apply"` or `"prepare"`).

```js
const varTag = tag.prepare('var');
varTag('y');

// => <var>y</var>
```

> <var>y</var>

---

If you need to use a tag as a string, one way to do so would be the `.outerHTML` attribute.

```js
p(["This becomes italic mid-",em("word"),"!"]).outerHTML;

// => "<p>This becomes italic mid-<em>word</em>!</p>"
```

> \<p>This becomes italic mid-\<em>word\</em>!\</p>

However, if you are using custom tags and you want to preserve character case, there is a workaround available. `tag.string()` computes attributes as normal, but then uses the original raw tag name, and does not render the children. As before, `tag.string.prepare()`/`tag.string[]`/`tag.prepare().string`/`tag[].string` is available to prepare a specific tag, e.g. `const MyTagString = tag.string['MyTag']`.

This means that any special characters (`&<"'`) in the children are not escaped, so HTML code can be passed through. For this reason, a helper function `tag.string.escape()` is provided.

```js
tag.string("aB",
    tag.string.escape("I <3"), code("tag.js"), tag.string("em","so"), "much!"
);

// => "<aB>First child. I &lt;3 <code>tag.js</code> <em>so</em> much!</aB>"
```

> \<aB>First child. I \&lt;3 \<code>tag.js\</code> \<em>so\</em> much!\</aB>
