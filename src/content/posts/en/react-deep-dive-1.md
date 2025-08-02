---
title: '[React] Deep Dive into React (1)'
summary: 'React is a JavaScript library for building user interfaces'
tags: ['React']
date: '2023-12-11 18:00:00'
---
Looking at various development research and job postings, it has become difficult to call yourself a frontend developer without knowing how to use React.

Of course, I know how to use React, but I felt that I need a deeper understanding to know how to use it well in different situations - to grow from a simple `framework user` to an `engineer`. So I've been continuously studying using Udemy and Obsidian.

Starting with this post, I want to leave traces of my exploration and contemplation about React.

> #### TL;DR
> - Let's understand what React is
> - Let's learn about React's core concepts

---

## What is React?
> **The library for web and native user interfaces**

As you can see from the official documentation definition, React is **a library for web and native user interfaces**.
In other words, it's a JavaScript library for building user interfaces.

So why was React created and why do we use it?
According to the [official documentation](https://ko.legacy.reactjs.org/blog/2013/06/05/why-react.html), in traditional JavaScript applications, when specific data changes, the user interface is updated by directly manipulating and updating the DOM. This approach has the disadvantage of being difficult to maintain and prone to bugs in complex applications.

React was created to solve these problems in a new way.
True to the meaning of the word "react," it responds to data changes and reflects them in the DOM more easily, enabling the construction of much more dynamic websites.

Using React requires less effort compared to using **JavaScript alone** and allows you to handle error situations.

Moreover, it provides various benefits such as:
- Component reusability
- **Declarative programming**
  - Rendering the component and applying it to the DOM is React's responsibility
  - You only define the target state, while React figures out and handles the process
  - `IoC (Inversion of Control)`: Instead of the traditional way where code takes control, the framework takes control. React has IoC characteristics by controlling the rendering of components and data flow process.
- **Virtual DOM**
- **JSX**

> #### 📌 Recap
> In other words, React is a JavaScript library that enables quick and easy construction of developer-friendly user interfaces.

### Virtual DOM
> Reference link: [Virtual DOM and Internals](https://legacy.reactjs.org/docs/faq-internals.html)

![React Virtual DOM](https://i2.wp.com/programmingwithmosh.com/wp-content/uploads/2018/11/lnrn_0201.png?ssl=1)

Virtual DOM is a programming concept that keeps an ideal or "virtual" representation of the UI in memory and synchronizes it with the "real" DOM by a library such as ReactDOM. This process is called [Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html).

In other words, React doesn't manipulate the actual DOM but manipulates a virtual DOM and reflects it to the actual DOM, thereby improving rendering performance. This process uses a **diffing algorithm**.

### Diffing Algorithm
React implemented the [Diffing Algorithm](https://legacy.reactjs.org/docs/reconciliation.html#the-diffing-algorithm) based on two assumptions:
1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements may be stable across different renders with a `key` prop.

When the root elements have different types, React will tear down the old tree and build the new tree from scratch.
When comparing DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes.

For child nodes, reconciliation proceeds through recursive processing.
If a child node is added at the end, only the added node needs to be added to the tree.
Otherwise, all child nodes would need to be changed, which is solved by using the `key` attribute.

> **Using index as `key` is a last resort.**
> Components are updated and reused based on the key. If the key value is an index, moving an item would change the key. As a result, the component's state becomes tangled in unexpected ways.

### JSX
JSX (Javascript Syntax Extension) is an extension of JavaScript syntax that allows you to write markup similar to HTML in JS files.

Traditionally, web environments were structured with page logic in JavaScript and markup written in HTML. However, as the web became more interactive, logic often determined content, which is **the reason why rendering logic and markup exist in the same place in React**.

## Components
Components are React's core concept and can be said to be everything about React.

In React, a component is:
> - A reusable and independent piece of code that defines how a UI element or part of the UI should behave and appear.
> - Components are the most fundamental concept in React and can be thought of as independent modules that encapsulate specific functionality.

So why do we need components?
- **Reusability**
  You can combine markup, CSS, and JavaScript logic into one "component". This increases code reusability and makes maintenance easier.

- **Separation of concerns**
  Since components are independent, you can develop them without affecting other components. This allows developers to develop components without worrying about other components.

Reusability and separation of concerns are important concepts not only in React but in programming in general. React uses the concept of components to solve this.

> #### 📌 Recap
> - A component is a reusable and independent piece of code that defines how a UI element or part of the UI should behave and appear.
> - A component is a JavaScript function that can be sprinkled with markup.

## Conclusion
This feels like the proper studying I wanted to do.
I need to study on my own, dig deep into curious content, organize it, and make it all mine!

> **What I learned through this post**
> - React is a JavaScript library for building UI.
> - React advocates declarative programming.
> - React improves rendering performance through Virtual DOM and reconciliation.
> - React uses the concept of components to solve reusability and separation of concerns.

---
**References**
- [react.dev](https://react.dev/)
- [Quanda Team Blog - Declarative React, and Inversion of Control](https://blog.mathpresso.com/declarative-react-and-inversion-of-control-7b95f3fbddf5)
- [[React] What is Reconciliation? (+ virtual DOM, React is declarative)](https://velog.io/@syoung125/eact-Reconciliation%EC%9D%B4%EB%9E%80-virtual-DOM-%EB%A6%AC%EC%95%A1%ED%8A%B8%EA%B0%80-%EC%84%A0%EC%96%B8%EC%A0%81)