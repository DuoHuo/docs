import { navItems, categories } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  id: string;
  title: string;
  href: string;
  activeItem?: string;
  onNavigate?: () => void;
};

function NavLink({ id, title, href, activeItem, onNavigate }: NavLinkProps) {
  const isActive = activeItem === id;
  return (
    <a
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      {title}
    </a>
  );
}

export function SiteNav({
  activeItem,
  onNavigate,
  className,
}: {
  activeItem?: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          id={item.id}
          title={item.title}
          href={item.href}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
      ))}
      <div className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        栏目
      </div>
      {categories.map((c) => (
        <NavLink
          key={c.slug}
          id={c.slug}
          title={c.label}
          href={`/blog/${c.slug}`}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
