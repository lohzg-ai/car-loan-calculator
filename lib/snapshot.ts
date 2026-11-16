/**
 * Browser-only helpers for Save / Copy / Share.
 * html-to-image is imported lazily so it never ships in the initial bundle.
 */

let warmedUp = false;

export async function renderPng(node: HTMLElement): Promise<Blob> {
  const { toBlob } = await import("html-to-image");
  const options = { pixelRatio: 2, backgroundColor: "#ffffff", cacheBust: false };
  // WebKit sometimes paints the first foreignObject render before web fonts are
  // embedded. A throwaway first pass makes the real capture reliable.
  if (!warmedUp) {
    await toBlob(node, options).catch(() => null);
    warmedUp = true;
  }
  const blob = await toBlob(node, options);
  if (!blob) throw new Error("Could not create image");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give Safari time to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function canCopyImage(): boolean {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  // ClipboardItem.supports is newer; assume PNG works where it's absent (Safari, older Chrome).
  const supports = (ClipboardItem as unknown as { supports?: (type: string) => boolean }).supports;
  return supports ? supports("image/png") : true;
}

/**
 * Passing a Promise<Blob> (not an awaited Blob) keeps the user-gesture alive in Safari,
 * which otherwise rejects clipboard writes that happen after async work.
 */
export function copyImage(blob: Promise<Blob>): Promise<void> {
  return navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fall through to the legacy path (insecure context, permissions, older WebViews).
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("Copy failed");
}

export function canShareFiles(file: File): boolean {
  return typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
}

export function errorName(err: unknown): string {
  return err instanceof Error ? err.name : "";
}
