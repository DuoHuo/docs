// Collapsed state for the desktop sidebar, stored on <html data-sidebar="collapsed">
// + localStorage. CSS (see global.css) reacts to the attribute, and an inline
// <head> script in BaseLayout restores it before first paint — so there is no
// flash on load or on ClientRouter navigation (the attribute lives on
// documentElement, which is not swapped between page transitions).

const STORAGE_KEY = "sidebar_collapsed";
const ATTR = "data-sidebar";
const COLLAPSED = "collapsed";

function setSidebarCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    /* ignore quota / privacy mode */
  }
  if (collapsed) document.documentElement.setAttribute(ATTR, COLLAPSED);
  else document.documentElement.removeAttribute(ATTR);
}

export function toggleSidebar(): void {
  const collapsed = document.documentElement.getAttribute(ATTR) === COLLAPSED;
  setSidebarCollapsed(!collapsed);
}
