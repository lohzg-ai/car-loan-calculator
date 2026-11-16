import LoanCalculator from "@/components/LoanCalculator";

export default function Home() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
          <p className="eyebrow tracking-[0.22em] text-ink">Car Loan Calculator</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-20">
        <div className="mb-12 max-w-2xl sm:mb-16">
          <h1 className="text-3xl leading-tight font-light tracking-[0.1em] text-ink uppercase sm:text-4xl">
            Plan your next drive
          </h1>
          <p className="mt-4 text-base leading-relaxed text-mid">
            Estimate your monthly car loan instalment in Singapore. Results update as you type and
            nothing leaves your browser.
          </p>
        </div>

        <LoanCalculator />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-mid sm:px-8">
          For illustration only. Actual loan terms are set by your lender.
        </div>
      </footer>
    </>
  );
}
