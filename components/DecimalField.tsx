"use client";

import { useLayoutEffect, useRef } from "react";
import { groupThousands, sanitizeDecimal } from "@/lib/format";

interface DecimalFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error: string | null;
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  /** Show thousand separators while typing. */
  group?: boolean;
  maxIntDigits?: number;
}

const SIGNIFICANT = /[\d.]/;

/**
 * Text input for money/percent values. Uses inputMode="decimal" for the mobile
 * numeric keypad, strips stray characters, and keeps the caret in place when
 * thousand separators are inserted or removed.
 */
export function DecimalField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  prefix,
  suffix,
  placeholder,
  group = false,
  maxIntDigits = 10,
}: DecimalFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = inputRef.current;
    const caret = pendingCaret.current;
    pendingCaret.current = null;
    if (el && caret !== null && document.activeElement === el) {
      el.setSelectionRange(caret, caret);
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    // How many meaningful characters sit before the caret?
    const before = raw.slice(0, caret).replace(/[^\d.]/g, "").length;

    const clean = sanitizeDecimal(raw, maxIntDigits);
    const next = group ? groupThousands(clean) : clean;

    let pos = 0;
    for (let seen = 0; pos < next.length && seen < before; pos++) {
      if (SIGNIFICANT.test(next[pos])) seen++;
    }
    pendingCaret.current = pos;
    onChange(next);
  }

  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-charcoal">
        {label}
      </label>
      <div
        className={`mt-3 flex h-14 items-center border-b bg-mist px-4 transition-colors duration-150 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${
          error ? "border-error" : "border-transparent"
        }`}
      >
        {prefix && (
          <span aria-hidden="true" className="mr-2 text-base text-mid">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required
          className="tabular h-full w-full min-w-0 bg-transparent text-lg font-normal text-ink outline-none placeholder:text-mid placeholder:font-light"
        />
        {suffix && (
          <span aria-hidden="true" className="ml-2 shrink-0 text-base text-mid">
            {suffix}
          </span>
        )}
      </div>
      {/* Reserved height prevents layout shift when a message appears. */}
      <div className="mt-2 min-h-5 text-sm leading-5">
        {error ? (
          <p id={errorId} className="font-normal text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-mid">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
