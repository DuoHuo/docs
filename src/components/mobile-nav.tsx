import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";
import { SiteNav } from "./site-nav";
import { SocialIcons } from "./social-icons";

export default function MobileNav({ activeItem }: { activeItem?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <a
          href="/"
          className="flex flex-col items-center gap-3 px-6 pb-6 pt-8"
        >
          <img
            src={siteConfig.avatar}
            alt={siteConfig.name}
            width={80}
            height={80}
            className="size-20 rounded-2xl object-cover ring-1 ring-border"
          />
          <div className="text-center">
            <div className="text-sm font-semibold text-sidebar-foreground">
              {siteConfig.name}
            </div>
            <div className="text-xs text-muted-foreground">{siteConfig.role}</div>
          </div>
        </a>
        <div className="px-3">
          <SiteNav
            activeItem={activeItem}
            onNavigate={() => setOpen(false)}
          />
        </div>
        <div className="border-t border-sidebar-border px-3 py-4">
          <SocialIcons className="justify-center" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
