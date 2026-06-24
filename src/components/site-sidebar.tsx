import { siteConfig } from "@/lib/site";
import { SiteNav } from "./site-nav";
import { SocialIcons } from "./social-icons";

// Desktop sidebar. Collapse is driven purely by CSS based on the
// <html data-sidebar="collapsed"> attribute (set from localStorage); this
// component is stateless so re-mounting across ClientRouter navigations
// causes no flash.
export default function SiteSidebar({ activeItem }: { activeItem?: string }) {
  return (
    <aside className="site-sidebar sticky top-0 hidden h-screen w-64 shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-linear lg:flex lg:flex-col">
      {/* Fixed 64-width inner column so content does not reflow as the aside
          animates between 64 and 0; overflow clips it during collapse. */}
      <div className="sidebar-inner flex h-full w-64 flex-col">
        <a href="/" className="flex flex-col items-center gap-3 px-6 pb-6 pt-8">
          <img
            src={siteConfig.avatar}
            alt={siteConfig.name}
            width={80}
            height={80}
            loading="eager"
            className="size-20 rounded-2xl object-cover ring-1 ring-border"
          />
          <div className="text-center">
            <div className="text-sm font-semibold text-sidebar-foreground">
              {siteConfig.name}
            </div>
            <div className="text-xs text-muted-foreground">{siteConfig.role}</div>
          </div>
        </a>
        <div className="flex-1 overflow-y-auto px-3">
          <SiteNav activeItem={activeItem} />
        </div>
        <div className="border-t border-sidebar-border px-3 py-4">
          <SocialIcons className="justify-center" />
        </div>
      </div>
    </aside>
  );
}
