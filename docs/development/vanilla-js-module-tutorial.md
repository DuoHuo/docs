---
title: 菜鸟的 JavaScript 模块开发教程（原生）
author: 玉藻前
date: 2023-09-16
comments: true
tags:
  - 开发
  - 前端
  - JavaScript
---

## 菜鸟的 JavaScript 模块开发教程（原生）

笔者好菜的（笑），实际上是习惯写的技术栈太复古。
所以本文不涉及 Node.js（`CommonJs` 规范）以及 ES6 的 `import ... from ...`。

JS 的标准、市场更新得太快，如果你想和某个时代说再见，不妨写一篇文章来饯别。

> 本文为我原创，如需转载，请注明作者为玉藻前。

## 写点啥

我们写一个页面加载模块 `waitControl`，大概就是加载动画那种。
在引用后，你可以使用 `waitControl.start();`，动画启动！
在业务资源加载完毕后，使用 `waitControl.end();`，关掉动画！

## 实现什么呢

我们可能会内置好几种动画、配色方案、语言，并且可能需要根据用户的样式来自动调整。
又或者，类似 `MathJax / Katex` 等渲染模块，允许用户通过在页面上添加一个 `json` 配置，自动地配置模块。

因此，我们除了主要逻辑，还需要暴露一些方法，允许用户适当地配置一下。

当然啦，`css` 是必须配套使用的，尽管我们不会详细介绍。

## 规划

这里介绍一种我喜欢的代码规划。

`waitControl` 会分为三部分：

1. `Utils` 工具函数（完全不暴露）
2. `Constructor` 实例构造器（暴露一些方法，比如 `start()` 和 `end()`）
3. `Export` 导出，也是唯一的出口

第 2 部分是主要逻辑，相对复杂，但是余两部分很简单。

这里不妨直接给出包含完整的第 3 部分的代码，可以配合注释阅读。
没有过多的具体逻辑，只有大致框架：

```js
var waitControl = (function () {
    'use strict';

    /* Utils */
    function inherit(original, ...objects) { } // 默认配置 -> 用户 Json 的继承

    /* Constructor */
    const Constructor = function (ctrl) {

        function configMaker(userConfig) { } // 会用到上面的 Utils
        function start() { }
        function end()   { }

        // 选择暴露哪些方法
        Object.assign(ctrl, { configMaker, start, end });
        return ctrl;
    }

    /* Export */
    var waitControl = Constructor({});

    return waitControl;
})();
```

在你需要的页面内引用 `<script src="./waitControl.js"></script>`，
随后就可以使用 Constructor 内主动暴露的部分了。

## Util 工具函数

前面说了，我们最初有一个默认的配置文件，也许是默认的背景颜色，
然后用户可以指定『部分字段 (Key)』的值 (Value)，并且只传入『部分字段』的值，其他部分还是默认的。

很容易想到，可以实现一个，继承功能的函数（可以仔细看一下这个函数）。

```js
/* utils */
function inherit(original, ...objects) {
    const result = Object.create(null);

    for (const key in original) {
        result[key] = original[key];
    }
    objects.forEach(function (obj) {
        for (const key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}
```

如果你要去面试，你可以记一下，这个代码实现的功能叫做 **浅合并（Shallow Merge）**。
假设你前面认真看了这个函数，你会发现，要是『部分字段』的值依然是一个对象（如 json），这个函数并不会处理它，只是直接用 `objects` 的对应字段覆盖掉 `original` 的。

那么深合并（Deep Merge）怎么做呢？欢迎大家去学习，可以在 DH 例会结束后找我交流，如果能答对我的提问，我就会请你喝奶茶 ~~

## Constructor 构造器

我们写的是一个页面加载模块。
它可能有一个覆盖在页面上方的背景，然后中间可能会有一个东西，比如说，一个方块，而且会跳。

此外，还会有消失动画，比如说缓慢淡化。

```js
const Constructor = function (ctrl) {

    let options = {
        backGroundColor: "#212121",          // 加载页面的背景颜色
        vanishTime: 2000,                    // 消失动画的持续时间
        blockDisplayAnimationName: "bounce", // 方块动画
        vanishAnimationName: "vanish"        // 消失动画
    }
    function configMaker(outerOptions) {     // 传入外部的 json
        options = inherit(options, outerOptions);
    }

    let language = { ... }        // 同理
    function langMaker(outerLang) { ... }

    // 由于东西较多，这里只展示部分业务逻辑
    function start() {
        blockDisplay.className = language.blockDisplayClassName;
        backGround.appendChild(blockDisplay);
        return true;
    }
    function end() {
        backGround.classList.add(options.vanishAnimationName);
        backGround.style.animationDuration = options.vanishTime + 'ms';
    }

    // 暴露这些方法
    Object.assign(ctrl, { configMaker, langMaker,
                          start, end });
    return ctrl;
}
```
