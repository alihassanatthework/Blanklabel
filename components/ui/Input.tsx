import { AlertCircle } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-[10px] border border-line bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 " +
  "transition-colors hover:border-navy-700/40 focus:border-navy-700 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-navy-700/25 " +
  "aria-[invalid=true]:border-danger";

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

export function FieldShell({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink-900">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  function Input({ label, error, hint, required, className, id: idProp, ...props }, ref) {
    const auto = useId();
    const id = idProp ?? auto;
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(field, "h-12")}
          {...props}
        />
      </FieldShell>
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ label, error, hint, required, className, id: idProp, ...props }, ref) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        ref={ref}
        id={id}
        rows={4}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(field, "py-3")}
        {...props}
      />
    </FieldShell>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps & { options: (string | { value: string; label: string })[]; placeholder?: string }
>(function Select({ label, error, hint, required, className, id: idProp, options, placeholder, ...props }, ref) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <SelectControl
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        options={options}
        placeholder={placeholder}
        {...props}
      />
    </FieldShell>
  );
});

/** Bare styled native select (no label) - used for Sort and compact selects. */
export const SelectControl = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: (string | { value: string; label: string })[];
    placeholder?: string;
  }
>(function SelectControl({ options, placeholder, className, ...props }, ref) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(field, "h-12 appearance-none pr-10", className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          );
        })}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-600"
      >
        <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </div>
  );
});
