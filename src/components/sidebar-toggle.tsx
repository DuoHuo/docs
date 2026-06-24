import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSidebar } from "@/lib/sidebar-state";

// Desktop-only trigger. Icons swap via CSS based on the <html data-sidebar>
// attribute (see global.css), so this is stateless and survives ClientRouter
// navigations without flicker.
export default function SidebarToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hidden shrink-0 lg:inline-flex"
      aria-label="切换侧边栏"
      title="切换侧边栏"
      onClick={toggleSidebar}
    >
      <PanelLeftClose className="sidebar-toggle-close size-5" />
      <PanelLeftOpen className="sidebar-toggle-open size-5" />
    </Button>
  );
}
