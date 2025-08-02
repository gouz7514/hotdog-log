---
title: '[React] Deep Dive into React (3) - Advanced Learning (1)'
summary: 'Fragment, Portal, and Ref'
tags: ['React']
date: '2023-12-19 16:00:00'
---

Through the posts so far, I've learned about React's core concepts and basic principles.
In this post, I want to organize various advanced concepts based on these basic concepts.

---
## Fragment
In React, components must return only one root element.
To prevent unnecessary elements like `<div>` from being rendered, you can use `Fragment`.
`Fragment` can be abbreviated as `<></>`.

```html
<>
  <ChildA />
  <ChildB />
</>
```

Grouping elements with `Fragment` doesn't affect the DOM result. This means it's the same as if the elements weren't grouped.

### Cautions
You can use the `key` attribute on `Fragment`. In this case, you must explicitly use `Fragment`.

In React, when state is reset varies depending on the code. For details, refer [here](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)!

## Portal
When developing web apps with React, you often need to develop modals, dialogs, etc. In this case, if you render elements within the page, they will be located inside other HTML code, which is not good from a styling and accessibility perspective.

To solve this, you can use `Portal`. `Portal` allows you to render child elements anywhere in the DOM tree.

### Usage
- **Create a place to move the component.**
ex) Add `<div id="modal-root"></div>` to the `index.html` file.

- **[createPortal()](https://react.dev/reference/react-dom/createPortal)**
```jsx
<div>  
  <SomeComponent />  
  {createPortal(children, domNode, key?)}  
</div>
```
`createPortal()` takes two arguments:
`children`: React node to be rendered
`domNode`: Actual DOM area where it will be rendered

Using `Portal` allows you to create modals and dialogs that don't affect the page flow as mentioned above.
You can also use it to render React components into non-React DOM nodes.

> #### Cautions
> - It's important to ensure that your application's accessibility is maintained.
> - For modals, it's important to follow WAI-ARIA modal authoring practices.

## Ref
When you want a component to remember some information but don't want that information to trigger new renders, you can use a `Ref`.

```javascript
import { useRef } from 'react';

const ref = useRef(0);
```

`useRef` returns an object like this:
```javascript
{
	current: 0,
}
```

You can access the value through the `ref.current` property. This value is not tracked by React. This breaks away from React's unidirectional data flow.
This value should not be read or written during the rendering process. Since React doesn't know about changes to the `ref.current` value, it becomes difficult to predict the application's behavior.

---
> **What I learned through this post**
> - `Fragment` allows you to avoid rendering unnecessary elements.
> - `Portal` allows you to render child elements anywhere in the DOM tree.
> - `Ref` allows a component to remember some information without triggering renders.

To be continued...