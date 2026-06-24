# 多火知识库

南信大 DH 互联网技术社团的技术积累与知识库。

基于 **Astro 7 + Tailwind CSS 4 + shadcn/ui**，内容由 Markdown/MDX 驱动，按 **栏目**（`agent` / `rag` / `infra` / `algorithm` / `train` / `rl` / `networking` / `development` / `system`）组织。

## 目录结构

```
src/
├── content/blog/<栏目>/<文章>.mdx   # 文章，栏目 = 一级目录
├── content.config.ts                # 内容集合 schema
├── lib/site.ts                      # 站点身份、栏目、社交链接
├── components/                      # Astro 组件 + React island（侧边栏/移动端导航）
├── layouts/                         # BaseLayout / PostLayout
└── pages/
    ├── index.astro                  # 首页（栏目卡片 + 最近文章）
    └── blog/
        ├── index.astro              # 全部文章
        └── [category]/
            ├── index.astro          # 栏目列表
            └── [slug].astro         # 文章详情
```

## 本地开发

```bash
pnpm install
pnpm dev       # 开发服务器
pnpm build     # 构建到 dist/
pnpm preview   # 预览构建产物
```

需要 Node ≥ 22、pnpm 11。

## 写文章

在 `src/content/blog/<栏目>/` 下新建 `.mdx`，frontmatter：

```yaml
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-06-24
author: 作者
tags:
  - 标签1
---
```

文章 URL 自动为 `/blog/<栏目>/<文件名>/`。

## 部署

推送到 `main` 即触发 GitHub Actions（`.github/workflows/deploy.yml`）构建并部署到 Cloudflare Pages 项目 `duohuo-docs`（[docs.duohuo.org.cn](https://docs.duohuo.org.cn)）。
