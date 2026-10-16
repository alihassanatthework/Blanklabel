import { Printer } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

export function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[16px] border border-dashed border-line bg-white px-6 py-14 text-center">
      <svg viewBox="0 0 160 110" className="w-40" aria-hidden>
        <rect x="20" y="20" width="90" height="70" rx="8" fill="var(--color-navy-50)" stroke="var(--color-line)" />
        <rect x="40" y="10" width="90" height="70" rx="8" fill="#fff" stroke="var(--color-line)" />
        <rect x="52" y="24" width="40" height="5" rx="2" fill="var(--color-ink-400)" />
        <rect x="52" y="34" width="60" height="4" rx="2" fill="var(--color-line)" />
        <circle cx="118" cy="78" r="16" fill="#fff" stroke="var(--color-navy-700)" strokeWidth="3" />
        <path d="M130 90l12 12" stroke="var(--color-navy-700)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <p className="mt-5 text-h4">No labels match those filters.</p>
      <p className="mt-1 text-ink-600">Try the printer finder or clear filters.</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ButtonLink href="/printer-finder">
          <Printer aria-hidden className="size-4" />
          Try the printer finder
        </ButtonLink>
        {onClear && (
          <Button variant="secondary" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
