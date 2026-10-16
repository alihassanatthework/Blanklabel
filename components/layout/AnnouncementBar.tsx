"use client";

import Link from "next/link";
import { Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { loops } from "@/lib/motion";
import { useCatalog } from "./CatalogProvider";

const KEY = "bl-announcement-closed";

export function AnnouncementBar() {
  const { site } = useCatalog();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      setClosed(sessionStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % site.announcements.length), loops.rotateAnnouncement * 1000);
    return () => clearInterval(t);
  }, [reduce, paused, site.announcements.length]);

  if (closed) return null;
  const msg = site.announcements[reduce ? 0 : i];

  return (
    <div
      className="relative z-50 bg-navy-900 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x flex h-9 items-center justify-center text-[13px]">
        <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={msg.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {msg.href ? (
                <Link href={msg.href} className="link-underline font-medium">
                  {msg.text}
                </Link>
              ) : (
                <span className="font-medium">{msg.text}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <a
          href={site.phoneHref}
          className="hidden items-center gap-1.5 font-medium text-white/90 hover:text-white lg:inline-flex"
        >
          <Phone aria-hidden className="size-3.5" />
          {site.phone}
        </a>
        <button
          type="button"
          aria-label="Close announcement"
          onClick={() => {
            setClosed(true);
            try {
              sessionStorage.setItem(KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="ml-2 -mr-2 flex size-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
