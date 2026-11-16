# Car Loan Calculator

A minimalist, client-side car loan calculator for Singapore, using the flat-rate method. Built with Next.js (App Router), TypeScript and Tailwind CSS. The page is statically rendered, so Vercel serves it straight from its CDN.

## Features

- Live results on every keystroke, with inline validation and no pop-ups
- Flat-rate calculation: monthly and yearly instalments, total interest, total payable
- **Save as image** (PNG), **Copy** (image to clipboard, falling back to text) and **Share** (Web Share API with the image, shown only on touch devices)
- Inputs persist in `sessionStorage` only: they survive a refresh and clear when the tab or browser closes
- No backend, no cookies, no `localStorage`, no tracking
- Light and dark themes: follows the system by default, with a toggle (choice kept in `sessionStorage` for the session). The exported image is always light

## Formula

```
Total interest   = Loan amount × (Interest rate ÷ 100) × Tenure (years)
Total payable    = Loan amount + Total interest
Payable per year = Total payable ÷ Tenure (years)
Payable / month  = Total payable ÷ (Tenure (years) × 12)
```

Values are rounded to 2 decimals. The pure function lives in [`lib/calculateLoan.ts`](lib/calculateLoan.ts).

Example: S$100,000 at 2.68% for 5 years gives S$13,400.00 interest, S$113,400.00 total, S$22,680.00 per year and S$1,890.00 per month.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm test           # run unit tests once (Vitest)
npm run test:watch # watch mode
npm run lint       # ESLint
npm run build      # production build
npm start          # serve the production build
```

## Project structure

```
app/
  layout.tsx            Root layout, Jost font via next/font, SEO and Open Graph metadata
  page.tsx              Static page shell (title, intro)
  globals.css           Tailwind v4 theme tokens and small utilities
  icon.svg              Favicon
  opengraph-image.tsx   Open Graph image, generated at build time
components/
  LoanCalculator.tsx    Form state, session restore, layout
  DecimalField.tsx      Numeric text input (decimal keypad, thousand separators, caret handling)
  TenureField.tsx       Native select limited to 1–10 whole years
  MonthlyBar.tsx        Mobile top bar showing the monthly instalment when results are off-screen
  ResultsFigures.tsx    The four result figures (shared by the page and the exported image)
  SnapshotCard.tsx      Off-screen card captured for the PNG (inputs, date, results)
  ShareActions.tsx      Save / Copy / Share buttons and fallbacks
  Toast.tsx             Polite live-region toast
  ThemeToggle.tsx       Light/dark toggle button
lib/
  calculateLoan.ts      Pure calculation function
  calculateLoan.test.ts Unit tests
  validation.ts         Field validation and parsing
  format.ts             Currency, date and input formatting
  storage.ts            sessionStorage read/write (all wrapped in try/catch)
  snapshot.ts           Lazy html-to-image capture, download, clipboard helpers
  summary.ts            Plain-text summary used by Copy/Share fallbacks
  theme.ts              Theme head script (no flash) and toggle helpers
```

## Deploying to Vercel

No configuration is needed.

**From GitHub**

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected defaults (Framework: Next.js, build command `next build`) and click **Deploy**.

**With the Vercel CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

Open Graph URLs use `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel sets automatically. If you use a custom domain, they still resolve to your production deployment.

## Browser notes

- **Copy** writes a PNG via `ClipboardItem`. Where that isn't supported or is refused, it copies a text summary.
- **Share** opens the native share sheet with the PNG on touch devices, attaching the PNG where `navigator.canShare({ files })` allows and sending a text summary otherwise. The button is hidden on desktop, where Copy does the job.
- On iOS Safari the share sheet must open directly from a tap. If rendering the image takes too long, the app shows "Image ready. Tap Share again"; the second tap shares the cached image instantly.
- `html-to-image` is loaded only when you first click Save, Copy or Share.

## Disclaimer

Flat-rate estimate for illustration only. Actual terms are set by your lender. This is a generic calculator and is not affiliated with any car brand or lender.
