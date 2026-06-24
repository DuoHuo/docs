// Central site identity, navigation, and category (栏目) config.

export const siteConfig = {
  name: "多火知识库",
  shortName: "多火",
  role: "南信大 DH 互联网技术社团",
  description: "南信大 DH 互联网技术社团的技术积累与知识库",
  avatar: "/duohuo/logo-girl-450.webp",
};

export type NavItem = { id: string; title: string; href: string };

export const navItems: NavItem[] = [
  { id: "home", title: "首页", href: "/" },
  { id: "blog", title: "全部文章", href: "/blog" },
];

export type Category = { slug: string; label: string; description: string };

// 栏目 — order is the display order in the sidebar.
export const categories: Category[] = [
  { slug: "agent", label: "Agent", description: "智能体构建、工具调用、多智能体架构、上下文工程" },
  { slug: "rag", label: "RAG", description: "检索增强生成、向量数据库、知识库" },
  { slug: "infra", label: "Infra", description: "推理服务、训练框架、分布式、部署" },
  { slug: "algorithm", label: "Algorithm", description: "模型架构、优化器、采样与解码策略" },
  { slug: "train", label: "Train", description: "模型训练、监督微调、对齐、蒸馏" },
  { slug: "rl", label: "RL", description: "强化学习、RLHF、GRPO、奖励建模" },
  { slug: "networking", label: "网络", description: "网络配置、路由器玩法、校园网相关实践" },
  { slug: "development", label: "开发", description: "前端、后端、Web 与各类编程实践" },
  { slug: "system", label: "系统", description: "操作系统、Linux 玩法、打包与系统配置" },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export type Social = { label: string; href: string; key: "rss" };

export const socialLinks: Social[] = [
  { label: "RSS 订阅", href: "/rss.xml", key: "rss" },
];

// Split a post id like "agent/context-engineering-strategies" into its category slug.
export function categoryOf(id: string): string | undefined {
  const seg = id.split("/")[0];
  return categories.some((c) => c.slug === seg) ? seg : undefined;
}

export function slugOf(id: string): string {
  const parts = id.split("/");
  return parts.length > 1 ? parts.slice(1).join("/") : parts[0];
}
