---
title: '👊 Crushing Package Managers'
summary: 'npm, yarn, and pnpm!'
tags: ['Career', 'Javascript']
date: '2024-10-27 21:00:00'
---
### TL;DR
- Learn about the simple operating principles of each package manager.
- Understand the advantages and disadvantages of each package manager.
---
## What is a Package Manager?
Before learning about package managers, let's first understand what a package is.

### Package
A package is a reusable piece of code. In other words, it's a collection distributed so that you can easily import and use frequently used functions or functions that are cumbersome to implement yourself.

So, a package manager is literally a tool that manages "packages." To elaborate, it's a tool that manages software libraries and dependencies. Package managers are tools that enhance project efficiency by managing dependencies during the process of installing these libraries.

It's not difficult content, but let me break it down with code examples:

**Direct implementation example**
```javascript
const removeDuplicates = (arr) => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
}

const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicates(numbers)); // [1, 2, 3, 4, 5];
```

**Example using a package (lodash)**
```javascript
const _ = require('lodash');

const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = _.uniq(numbers);

console.log(uniqueNumbers); // [1, 2, 3, 4, 5];
```

**package.json**
```json
{
	name: "project",
	version: "1.0.0",
	"dependencies": {
		"lodash": "^x.y.z"
	}
}
```

- You can implement the same functionality with shorter, more concise code using packages.
- Installed packages are specified in the package.json file, and package managers install and manage necessary packages according to these dependencies.

> ❓Dependency
> 💡 Third-party software written to solve software problems

In summary, a package manager is a tool that manages project dependencies.

## Three Stages of Package Manager Operation
Now that we know what a package manager is, let's learn how it operates.

> This explanation references [an article written by Toss](https://toss.tech/article/lightning-talks-package-manager), [yarn official documentation](https://yarnpkg.com/cli/install), and GPT.

### 1. Resolution
The Resolution stage can be defined in one word as **'determining (fixing) the required version (resolve dependencies)'**.
Package managers determine the required package versions by referencing `package.json` or `lock` files during this stage.

### 2. Fetch
This is the stage where **'the determined version packages are actually downloaded'** based on the Resolution results.
During this process, necessary packages are stored in the cache.

### 3. Link
This stage places downloaded packages in the project's node_modules and sets up symbolic links so that each package's dependencies can be properly referenced. In other words, it's **'the stage that provides an environment where Resolution/Fetched libraries can be used in source code'**.


## Types of Package Managers
This is the most important purpose of writing this article.
Let's learn about what purpose each package manager serves and their advantages and disadvantages.

### npm
npm (Node Package Manager), as the name suggests, is the most widely used package manager in the Node.js ecosystem, introduced in 2009 to make it easy for JavaScript developers to share packages.

As the first package manager to appear in the JS ecosystem, its biggest characteristic and advantage is that countless packages are shared and anyone can easily share and download them.

However, there's a chronic problem that npm users face, which is the dependency installation process.
npm basically stores all dependencies **under the node_modules directory** when installing each dependency, allowing different versions of all sub-dependency trees to be stored redundantly by permitting different versions of dependencies' dependencies.
Creating such complex tree structures means you have to keep traversing up node_modules to find packages, causing problems in terms of speed and capacity, and the same package with different versions can be installed redundantly.

### yarn
([Engineering at Meta - Yarn: A new package manager for JavaScript](https://engineering.fb.com/2016/10/11/web/yarn-a-new-package-manager-for-javascript/))

As the JavaScript community grew and each business's codebase became increasingly large, problems arose in terms of consistency, security, and performance. To solve this, yarn was introduced in 2016, led by Facebook.

yarn aimed to solve the following problems:
- Improve dependency management stability
- Performance improvement
- Consistent installation environment

yarn enabled faster package installation through parallel downloads and caching during the Fetching stage.
Also, yarn ensures package consistency by fixing exact versions of all dependencies through the yarn.lock file.
- If a `yarn.lock` file exists and satisfies all dependencies specified in package.json, it will be installed exactly as specified in `yarn.lock` and the `yarn.lock` file won't change.
- If a `yarn.lock` file doesn't exist or doesn't satisfy dependencies specified in package.json, it will find and install the latest version that can satisfy package.json conditions and save this to the `yarn.lock` file.

Also, yarn adopted a **flat node_modules structure** to solve the node_modules nesting problem.
A flat node_modules structure means yarn installs each package at the top level in the node_modules folder, avoiding duplicate installations for sub-packages and placing only a single version.
For example, if multiple packages have the same version of lodash as a dependency, it will be installed only once in node_modules/lodash and all packages will reference lodash at this location.

### pnpm
[pnpm Official Documentation - Motivation](https://pnpm.io/ko/motivation)
pnpm was released in 2017 to improve disk space efficiency and package installation speed.

#### Improving Disk Space Efficiency
pnpm stores all dependencies globally in a single location and references them via hard links, consuming no additional disk space.

#### Improving Installation Speed
1. Resolution: Identifies all necessary dependencies and fetches them to the store.
2. Fetch: Calculates the node_modules directory structure based on dependencies.
3. Link: All remaining dependencies are fetched from the store to node_modules and hard linked.

Thanks to the hard link approach, pnpm can solve capacity and speed problems.
Install dependencies only once and access that location directly!

Also, pnpm uses symlinks to make project dependencies reference each other. All dependencies of a specific package become symbolic links to appropriate directories within `node_modules/.pnpm/`.
(For more details, I should read and study [pnpm Official Documentation - Flat node_modules is not the only way](https://pnpm.io/ko/blog/2020/05/27/flat-node-modules-is-not-the-only-way))

### (Additional Concept) PnP (Plug'n'Play)

PnP is a strategy that appeared in yarn berry, the latest version of yarn.
(Note that PnP is not a package manager but a way of installing packages.)

PnP is characterized by handling dependencies without node_modules (!).
PnP records dependencies in a `.pnp.cjs` file and directly loads packages in memory, enabling faster package installation. During this process, it manages dependency issues more strictly by specifying all dependency versions in a single file.

```cjs
// pnp.cjs
["my-service", /* ... */ [{
  // From ./my-service...
  "packageLocation": "./my-service/",
  "packageDependencies": [
    // When importing React, provide version 18.2.0.
    ["react", "npm:18.2.0"]
  ]
]
```
By specifying packages and versions as above and not using node_modules, it further improved the speed of the Link stage.

---
## Conclusion
This way, I briefly covered what package managers are, what problems each package manager solves, and even PnP.
What I felt while writing this article is that ultimately, the most important point in studying is focusing on **what problems this technology solves** makes understanding the technology much faster.
I think if I think once more about what problems this technology solves and what problems I can solve using this technology, I can grow into a better developer. It was difficult but very rewarding study!

---
### Referenced Articles
- [toss tech - Past, Present, and Future of Package Managers](https://toss.tech/article/lightning-talks-package-manager)
- [toss tech - Yarn Berry That Will Save Us From node_modules](https://toss.tech/article/node-modules-and-yarn-berry)  
- [Meta - Yarn: A new package manager for JavaScript](https://engineering.fb.com/2016/10/11/web/yarn-a-new-package-manager-for-javascript/)
- [npm Official Documentation](https://docs.npmjs.com/)
- [Yarn Official Documentation](https://yarnpkg.com/)
- [pnpm Official Documentation](https://pnpm.io/)
- [mdn web docs - Package management basics](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Package_management)