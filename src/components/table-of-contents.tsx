import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { depth: number; slug: string; text: string };

// Right-side table of contents for article pages. Renders the h2/h3 from the
// post's headings (passed as props), scroll-spies, and smooth-scrolls on click
// (clearing the sticky header via scroll-margin in global.css). Hydrated with
// client:idle; SSR'd so links work immediately.
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const items = useMemo(
    () => headings.filter((h) => h.depth >= 2 && h.depth <= 3),
    [headings]
  );
  const [activeSlug, setActiveSlug] = useState<string>(items[0]?.slug ?? "");

  useEffect(() => {
    const els = items
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      // Active = the last heading whose top has scrolled past the header band.
      const threshold = 120;
      let current = els[0];
      for (const el of els) {
        if (el.getBoundingClientRect().top - threshold <= 0) current = el;
      }
      // At the page bottom the final (short) section may never cross the
      // threshold; snap to the last heading so the TOC stays in sync.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = els[els.length - 1];
      }
      setActiveSlug(current.id);
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length < 2) return null;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    document
      .getElementById(slug)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${slug}`);
  };

  return (
    <nav aria-label="目录">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        目录
      </p>
      <ul>
        {items.map((h) => {
          const active = activeSlug === h.slug;
          return (
            <li key={h.slug}>
              <a
                href={`#${h.slug}`}
                onClick={(e) => onClick(e, h.slug)}
                className={cn(
                  "block border-l-2 py-1.5 text-sm transition-colors",
                  h.depth === 3 ? "pl-7" : "pl-4",
                  active
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
