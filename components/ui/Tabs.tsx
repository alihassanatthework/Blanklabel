"use client";

import * as T from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { durations, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface TabData {
  id: string;
  label: string;
  content?: React.ReactNode;
}

/** Tabs with a sliding underline (layoutId). Controlled or uncontrolled. */
export function Tabs({
  tabs,
  value: controlled,
  onValueChange,
  className,
  listClassName,
  label,
  children,
}: {
  tabs: TabData[];
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  listClassName?: string;
  label: string;
  children?: React.ReactNode;
}) {
  const [inner, setInner] = useState(tabs[0]?.id);
  const value = controlled ?? inner;
  const uid = useId();
  return (
    <T.Root
      value={value}
      onValueChange={(v) => {
        setInner(v);
        onValueChange?.(v);
      }}
      className={className}
    >
      <T.List
        aria-label={label}
        className={cn("no-scrollbar flex gap-1 overflow-x-auto border-b border-line", listClassName)}
      >
        {tabs.map((t) => (
          <T.Trigger
            key={t.id}
            value={t.id}
            className="relative shrink-0 px-3 py-3 text-[15px] font-semibold whitespace-nowrap text-ink-600 transition-colors hover:text-navy-700 data-[state=active]:text-navy-900"
          >
            {t.label}
            {value === t.id && (
              <motion.span
                layoutId={`tab-underline-${uid}`}
                className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-action-500"
                transition={{ duration: durations.base, ease: ease.out }}
              />
            )}
          </T.Trigger>
        ))}
      </T.List>
      {tabs.map(
        (t) =>
          t.content !== undefined && (
            <T.Content key={t.id} value={t.id} className="pt-6 focus-visible:outline-none">
              {t.content}
            </T.Content>
          ),
      )}
      {children}
    </T.Root>
  );
}
