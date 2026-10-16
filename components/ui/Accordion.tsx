"use client";

import * as A from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

/** Single-open accordion; height animates 220 ms, chevron rotates 180 deg (CSS, off under reduced motion). */
export function Accordion({
  items,
  className,
  type = "single",
  defaultValue,
  headingLevel = 3,
  dense,
}: {
  items: AccordionItemData[];
  className?: string;
  type?: "single" | "multiple";
  defaultValue?: string[];
  headingLevel?: 2 | 3 | 4;
  dense?: boolean;
}) {
  const H = `h${headingLevel}` as "h3";
  const body = items.map((it) => (
    <A.Item key={it.id} value={it.id} className="border-b border-line last:border-b-0">
      <A.Header asChild>
        <H className="text-inherit" style={{ fontFamily: "inherit" }}>
          <A.Trigger
            className={cn(
              "group flex w-full items-center justify-between gap-4 text-left font-semibold text-navy-900 hover:text-navy-700",
              dense ? "py-3 text-sm" : "py-5 text-base lg:text-[17px]",
            )}
          >
            {it.title}
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-navy-700 transition-transform duration-[220ms] group-data-[state=open]:rotate-180"
            />
          </A.Trigger>
        </H>
      </A.Header>
      <A.Content className="accordion-content overflow-hidden">
        <div className={cn("text-ink-600", dense ? "pb-3 text-sm" : "pb-5 pr-8")}>{it.content}</div>
      </A.Content>
    </A.Item>
  ));
  return type === "single" ? (
    <A.Root type="single" collapsible defaultValue={defaultValue?.[0]} className={className}>
      {body}
    </A.Root>
  ) : (
    <A.Root type="multiple" defaultValue={defaultValue} className={className}>
      {body}
    </A.Root>
  );
}
