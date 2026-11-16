/**
 * Light/dark theme. The page always carries data-theme="light" | "dark" on <html>:
 * the user's choice for this session if they made one, otherwise the system setting.
 * The choice lives in sessionStorage, like the form inputs, so the app keeps its
 * "no cookies, no localStorage" promise.
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "car-loan-calculator:theme";

/**
 * Runs in <head> before first paint, so there is no flash of the wrong theme.
 * Also follows live system changes while the user hasn't picked a theme.
 */
export const THEME_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_KEY)},d=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");function a(){var s=null;try{s=sessionStorage.getItem(k)}catch(e){}d.setAttribute("data-theme",s==="light"||s==="dark"?s:m.matches?"dark":"light")}a();m.addEventListener("change",a)}catch(e){}})()`;

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.sessionStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage unavailable (private mode). The theme still applies for this page view.
  }
}

/** Notifies when data-theme on <html> changes (toggle or system change). */
export function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
