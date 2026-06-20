---
title: '解决 JSON 解析报错 Error: Unexpected character "{" at position 1'
author: 若熙
date: 2023-09-16
comments: true
tags:
  - 开发
  - 后端
  - JSON
---

当你看见形如 `Error: Unexpected character "{" at position 1` 报错，并且很确信你的 JSON 格式没有问题、第一个字符确实是 `{` 时 —— 看看哪个大聪明用了 **UTF-8 with BOM** 编码。
