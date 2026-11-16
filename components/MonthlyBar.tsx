"use client";

import { useEffect, useState, type RefObject } from "react";
import { formatSGD } from "@/lib/format";

/**
 * Mobile-only bar pinned to the top that shows the monthly instalment while the
 * big monthly figure is off-screen, so live results stay visible while typing.
 * Pinned to the top because iOS covers bottom-fixed elements with the keyboard.
 * Hidden from screen readers: the results live region already announces changes.
 */
export function MonthlyBar({ perMonth, target }: { perMonth: number | null; target: RefObject<HTMLElement | null> }) {
  const [targetVisible, setTargetVisible] = useState(true);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    // Only count the figure as visible when it is fully on screen.
    const io = new IntersectionObserver(([entry]) => setTargetVisible(entry.intersectionRatio >= 0.99), {
      threshold: [0, 0.99],
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const show = perMonth !== null && !targetVisible;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm transition-transform duration-200 lg:hidden ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-5 sm:px-8">
        <span className="label text-mid">Monthly instalment</span>
        <span className="tabular text-xl font-normal text-ink">{perMonth !== null ? formatSGD(perMonth) : ""}</span>
      </div>
    </div>
  );
}
