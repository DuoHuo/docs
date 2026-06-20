---
title: 开发
description: 前端、后端、Web 与各类编程实践
---

前端、后端、Web 与各类编程实践。

## 文章列表

- [二维码远程签到机](qrcode-remote-checkin.md)
    : 用 WebSocket 同步二维码，实现低延迟的远程签到。原生 JS + Golang，作者：Shen H。
- [解决 JSON 解析报错 Error: Unexpected character "{" at position 1](json-utf8-bom-error.md)
    : JSON 格式没问题却报 "Unexpected character" 时的元凶：UTF-8 with BOM。作者：若熙。
- [菜鸟的 JavaScript 模块开发教程（原生）](vanilla-js-module-tutorial.md)
    : 用原生 JS 写一个页面加载模块 `waitControl`，讲清 Utils / Constructor / Export 的模块划分思路。作者：玉藻前。
- [2API：把任意接口封装成 OpenAI 标准接口](openai-compatible-api.md)
    : 实现 `/v1/models` 与 `/v1/chat/completions` 两个关键接口，把任意非标准接口包装成 OpenAI 标准格式。作者：真真夜夜。
- [Jupyter 上的 CUDA 魔法函数](cuda-jupyter-magics.md)
    : 用 `%%writefile` / `%%shell` 等 cell 魔法函数在 Jupyter 里完成 CUDA 编写、编译、nsys 性能分析与 grid-strided 优化。作者：真真夜夜。
