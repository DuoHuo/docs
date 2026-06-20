---
icon: lucide/rocket
description: 南信大 DH 互联网技术社团的技术积累与知识库。
---

# 多火知识库

南信大 DH 互联网技术社团的技术积累与知识库。
这里收集社员的技术文章与实践经验，分门别类，供历届社友学习参考。

## 板块导航

### 网络

网络配置、路由器玩法、校园网相关实践。

- [OpenWrt 路由器让校园网速度超级加倍](networking/openwrt-campus-multilink.md) — 通过 macvlan + mwan3 多线多拨绕过墙口限制，自动登录校园网认证
- [中间人能知道我上什么网站吗？](networking/mitm-website-visibility.md) — 从应用层到链路层逐层分析 HTTPS 流量里会泄露哪些痕迹
- [在 VPS 上部署 Hysteria2](networking/hysteria2-vps-deploy.md) — Hy2 服务端部署 + Sparkle / Clash 客户端配置
- [VLESS 代理搭建教程](networking/vless-proxy-setup.md) — sing-box + VLESS-REALITY，配 fail2ban/ufw/BBR 的新手教程

[查看全部 →](networking/index.md)

### 开发

前端、后端、Web 与各类编程实践。

- [二维码远程签到机](development/qrcode-remote-checkin.md) — 用 WebSocket 低延迟同步二维码，原生 JS + Golang
- [解决 JSON 解析报错 Error: Unexpected character "{" at position 1](development/json-utf8-bom-error.md) — 元凶是 UTF-8 with BOM
- [菜鸟的 JavaScript 模块开发教程（原生）](development/vanilla-js-module-tutorial.md) — Utils / Constructor / Export 三段式模块划分
- [2API：把任意接口封装成 OpenAI 标准接口](development/openai-compatible-api.md) — 实现 /v1/models 与 /v1/chat/completions，包装成 OpenAI 标准格式
- [Jupyter 上的 CUDA 魔法函数](development/cuda-jupyter-magics.md) — 用 cell 魔法函数在 Jupyter 里做 CUDA 开发与 nsys 性能分析

[查看全部 →](development/index.md)

### 系统

操作系统、Linux 玩法、打包与系统配置实践。

- [在 AUR (Archlinux User Repository) 提交你的软件包](system/aur-package-submission.md) — 从注册账号、配置 SSH、写 PKGBUILD 到 push 上传

[查看全部 →](system/index.md)

### AI

大模型、智能体（Agent）、提示词与 AI 工程实践。

- [上下文管理四种技巧](ai/context-engineering-strategies.md) — 上下文工程四大策略：写入、选择、压缩、隔离

[查看全部 →](ai/index.md)
