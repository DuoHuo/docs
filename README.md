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
# 可选字段：
# updatedDate: 2026-06-25
# heroImage: /duohuo/cover.webp
# badge: 首发
---
```

文章 URL 自动为 `/blog/<栏目>/<文件名>/`。

> 栏目（`categories`）及其顺序、描述在 `src/lib/site.ts` 中定义；新增栏目需同时在此注册并在 `src/content/blog/` 下建对应目录。

## 贡献指南

欢迎社友投稿与改进。基本流程：

1. **拉取分支**：基于 `main` 新建分支，命名建议 `article/<栏目>/<主题>`、`fix/<简述>` 或 `feat/<简述>`。
2. **写作 / 改动**：新文章放在 `src/content/blog/<栏目>/` 下，frontmatter 见上一节；改动代码请保持现有风格（无 Prettier/ESLint，跟随文件内既有写法）。
3. **本地验证**：`pnpm build` 通过，并 `pnpm dev` 实际访问受影响的路由（`/blog/<栏目>`、`/blog/<栏目>/<slug>`）确认渲染正常。
4. **提交**：提交信息推荐用中文 Conventional Commits，例如：
   - `article: 新增 <栏目> 下关于 <主题> 的文章`
   - `fix: 修复 <页面/组件> 的 <问题>`
   - `refactor: <重构内容>`
   - `docs: 更新 README / AGENTS`
5. **发起 Pull Request**：PR 描述写清改了什么、为什么；涉及新栏目时注明已在 `src/lib/site.ts` 注册。经 Review 合并到 `main` 后自动部署（见下节）。

> 文章 URL 由文件路径决定（`/blog/<栏目>/<文件名>/`），重命名或移动文件会改变其链接，提交前请确认。正文支持 MDX，可使用 React 组件与 `astro:assets` 的 `<Image />`。

## 部署

推送到 `main` 即触发 GitHub Actions（`.github/workflows/deploy.yml`）构建并部署到 Cloudflare Pages 项目 `duohuo-docs`（[docs.duohuo.org.cn](https://docs.duohuo.org.cn)）。
