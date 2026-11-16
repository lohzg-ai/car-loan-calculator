"use client";

import { useEffect } from "react";

export interface ToastMessage {
  id: number;
  text: string;
}

/** The live region is always mounted so screen readers announce each new message. */
export function Toast({ message, onDone }: { message: ToastMessage | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [message, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      {message && (
        <p
          key={message.id}
          className="eyebrow bg-ink px-6 py-4 text-white motion-safe:animate-[toast-in_180ms_ease-out]"
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
