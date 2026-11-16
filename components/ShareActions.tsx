"use client";

import { useRef, useState, type RefObject } from "react";
import type { LoanResult } from "@/lib/calculateLoan";
import { formatDate, isoDate } from "@/lib/format";
import {
  canCopyImage,
  canShareFiles,
  copyImage,
  copyText,
  downloadBlob,
  errorName,
  renderPng,
} from "@/lib/snapshot";
import { textSummary, type SummaryInputs } from "@/lib/summary";

type Action = "save" | "copy" | "share";

interface ShareActionsProps {
  snapshotRef: RefObject<HTMLDivElement | null>;
  inputs: SummaryInputs | null;
  result: LoanResult | null;
  onToast: (text: string) => void;
}

const SHARE_TITLE = "Car loan estimate";

const base =
  "focus-ring eyebrow inline-flex min-h-12 flex-1 items-center justify-center px-5 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";
const primary = `${base} bg-ink text-white hover:bg-charcoal/85`;
const secondary = `${base} border border-ink text-ink hover:bg-ink hover:text-white`;

function isTouchDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function ShareActions({ snapshotRef, inputs, result, onToast }: ShareActionsProps) {
  const [busy, setBusy] = useState<Action | null>(null);
  // The last PNG, keyed by its content, so a repeat action (e.g. "tap Share again") is instant.
  const cache = useRef<{ key: string; blob: Blob } | null>(null);

  const disabled = !inputs || !result || busy !== null;

  function prepare() {
    const node = snapshotRef.current;
    if (!node || !inputs || !result) return null;
    const now = new Date();
    const dateLabel = formatDate(now);
    const dateEl = node.querySelector<HTMLElement>("[data-snapshot-date]");
    if (dateEl) dateEl.textContent = dateLabel;
    return {
      node,
      key: JSON.stringify([inputs, dateLabel]),
      filename: `car-loan-estimate-${isoDate(now)}.png`,
      text: textSummary(inputs, result, dateLabel),
    };
  }

  async function getBlob(node: HTMLElement, key: string): Promise<Blob> {
    if (cache.current?.key === key) return cache.current.blob;
    const blob = await renderPng(node);
    cache.current = { key, blob };
    return blob;
  }

  async function copyTextWithToast(text: string, success = "Copied as text") {
    try {
      await copyText(text);
      onToast(success);
    } catch {
      onToast("Couldn’t copy");
    }
  }

  async function handleSave() {
    const p = prepare();
    if (!p) return;
    setBusy("save");
    try {
      downloadBlob(await getBlob(p.node, p.key), p.filename);
      onToast("Image saved");
    } catch {
      onToast("Couldn’t create image");
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy() {
    const p = prepare();
    if (!p) return;
    if (canCopyImage()) {
      setBusy("copy");
      try {
        // Start the write synchronously inside the click so Safari keeps the gesture.
        await copyImage(getBlob(p.node, p.key));
        onToast("Copied");
        return;
      } catch {
        // Image copy refused; fall back to text below.
      } finally {
        setBusy(null);
      }
    }
    await copyTextWithToast(p.text);
  }

  async function handleShare() {
    const p = prepare();
    if (!p) return;

    if (typeof navigator.share !== "function" || !isTouchDevice()) {
      await copyTextWithToast(p.text, "Summary copied");
      return;
    }

    const cached = cache.current?.key === p.key ? cache.current.blob : null;
    let blob = cached;
    if (!blob) {
      setBusy("share");
      try {
        blob = await getBlob(p.node, p.key);
      } catch {
        blob = null;
      } finally {
        setBusy(null);
      }
    }

    const file = blob ? new File([blob], p.filename, { type: "image/png" }) : null;
    try {
      if (file && canShareFiles(file)) {
        await navigator.share({ files: [file], title: SHARE_TITLE });
      } else {
        await navigator.share({ title: SHARE_TITLE, text: p.text });
      }
    } catch (err) {
      const name = errorName(err);
      if (name === "AbortError") return; // user closed the share sheet
      if (name === "NotAllowedError" && !cached && blob) {
        // iOS drops the user gesture while the image renders. It's cached now,
        // so a second tap shares immediately.
        onToast("Image ready. Tap Share again");
        return;
      }
      await copyTextWithToast(p.text, "Summary copied");
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row" aria-busy={busy !== null}>
      <button type="button" className={primary} disabled={disabled} onClick={handleSave}>
        {busy === "save" ? "Saving…" : "Save as image"}
      </button>
      <button type="button" className={secondary} disabled={disabled} onClick={handleCopy}>
        {busy === "copy" ? "Copying…" : "Copy"}
      </button>
      <button type="button" className={secondary} disabled={disabled} onClick={handleShare}>
        {busy === "share" ? "Preparing…" : "Share"}
      </button>
    </div>
  );
}
