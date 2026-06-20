# 多火知识库

这是 `duohuo-docs` 的 Zensical 文档站源码。

## 开发

```bash
uv sync

uv run python -m zensical build --clean
```

本地预览：

```bash
uv run python -m zensical serve
```

## 部署

Vercel 使用 `vercel.json` 中的构建配置：

- install: install `uv` if missing, then `uv sync --frozen`
- build: `uv run python -m zensical build --clean`
- output: `site`
