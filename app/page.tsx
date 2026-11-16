import LoanCalculator from "@/components/LoanCalculator";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-20">
        <div className="mb-8 sm:mb-16">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl leading-tight font-light tracking-widest text-ink uppercase sm:text-4xl">
              Car loan calculator
            </h1>
            <ThemeToggle />
          </div>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-mid sm:mt-4">
            Estimate your monthly instalment in Singapore. Nothing leaves your browser.
          </p>
        </div>

        <LoanCalculator />
      </main>
    </>
  );
}
