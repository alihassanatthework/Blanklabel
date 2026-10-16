"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/nav";
import { useCart } from "@/lib/store/cart";
import { useHydrated, useUi } from "@/lib/store/ui";
import { useWishlist } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { PrinterMenuPanel, ShopMenuPanel } from "./MegaMenu";

// Heavy, rarely-opened UI is code-split.
const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), { ssr: false });
const MobileNav = dynamic(() => import("./MobileNav").then((m) => m.MobileNav), { ssr: false });

type MenuId = "shop" | "printer";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuId | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggers = useRef<Record<MenuId, HTMLButtonElement | null>>({ shop: null, printer: null });
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const cartVersion = useCart((s) => s.version);
  const wishCount = useWishlist((s) => s.ids.length);
  const { setCartOpen, setSearchOpen, setNavOpen, searchOpen, navOpen } = useUi();

  // Mount lazily on first open, then keep mounted so close animations can run.
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [navLoaded, setNavLoaded] = useState(false);
  useEffect(() => {
    if (searchOpen) setSearchLoaded(true);
  }, [searchOpen]);
  useEffect(() => {
    if (navOpen) setNavLoaded(true);
  }, [navOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  // Cmd/Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  // Click outside closes menus.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const hoverOpen = (id: MenuId | null) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(id), id ? 120 : 160);
  };

  const close = (focusTrigger?: MenuId) => {
    setOpen(null);
    if (focusTrigger) triggers.current[focusTrigger]?.focus();
  };

  const panelLinks = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);

  const onPanelKey = (e: React.KeyboardEvent, id: MenuId) => {
    const links = panelLinks();
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close(id);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      links[(i + 1) % links.length]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      links[(i - 1 + links.length) % links.length]?.focus();
    }
  };

  const onTriggerKey = (e: React.KeyboardEvent, id: MenuId) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(id);
      requestAnimationFrame(() => panelLinks()[0]?.focus());
    } else if (e.key === "Escape") close(id);
  };

  const menuButton = (id: MenuId, label: string) => (
    <li className="relative" onMouseEnter={() => hoverOpen(id)} onMouseLeave={() => hoverOpen(null)}>
      <button
        ref={(el) => {
          triggers.current[id] = el;
        }}
        type="button"
        aria-expanded={open === id}
        aria-controls={`menu-${id}`}
        onClick={() => setOpen(open === id ? null : id)}
        onKeyDown={(e) => onTriggerKey(e, id)}
        className={cn(
          "flex h-10 items-center gap-1 rounded-md px-2 text-[14px] font-medium whitespace-nowrap xl:px-3 xl:text-[15px] text-ink-900 hover:text-navy-700",
          open === id && "text-navy-700",
        )}
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-200", open === id && "rotate-180")}
        />
      </button>
    </li>
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white transition-[height,box-shadow,border-color] duration-200",
          scrolled ? "h-[60px] border-transparent shadow-md" : "h-[72px] border-line",
        )}
      >
        <div className="container-x flex h-full items-center gap-4">
          <Link
            href="/"
            aria-label="BlankLabels home"
            className="shrink-0 origin-left transition-transform duration-200"
            style={{ transform: scrolled ? "scale(0.9)" : "scale(1)" }}
          >
            <Logo />
          </Link>

          <nav ref={navRef} aria-label="Main" className="ml-2 hidden xl:ml-4 flex-1 lg:block">
            <ul className="flex items-center gap-0.5">
              {menuButton("shop", "Shop")}
              {menuButton("printer", "Shop by Printer")}
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className="link-underline mx-2 inline-flex h-10 items-center text-[14px] font-medium whitespace-nowrap text-ink-900 hover:text-navy-700 xl:mx-3 xl:text-[15px]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {open && (
              <motion.div
                ref={panelRef}
                id={`menu-${open}`}
                key={open}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => hoverOpen(open)}
                onMouseLeave={() => hoverOpen(null)}
                onKeyDown={(e) => onPanelKey(e, open)}
                className="absolute inset-x-0 top-full border-t border-line bg-white shadow-lg"
              >
                <div className="container-x py-8">
                  {open === "shop" ? <ShopMenuPanel /> : <PrinterMenuPanel />}
                </div>
              </motion.div>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <IconButton label="Search (Ctrl+K)" onClick={() => setSearchOpen(true)}>
              <Search aria-hidden className="size-5" strokeWidth={1.75} />
            </IconButton>
            <IconLink href="/account" label="My account" className="hidden sm:flex">
              <User aria-hidden className="size-5" strokeWidth={1.75} />
            </IconLink>
            <IconLink href="/wishlist" label={`Wishlist (${hydrated ? wishCount : 0} items)`} className="hidden sm:flex">
              <Heart aria-hidden className="size-5" strokeWidth={1.75} />
              {hydrated && wishCount > 0 && <CountBadge n={wishCount} tone="navy" />}
            </IconLink>
            <IconButton id="cart-button" label={`Cart (${hydrated ? cartCount : 0} items)`} onClick={() => setCartOpen(true)}>
              <ShoppingCart aria-hidden className="size-5" strokeWidth={1.75} />
              {hydrated && cartCount > 0 && (
                <motion.span
                  key={cartVersion}
                  initial={reduce ? false : { scale: 1 }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.35 }}
                  className="absolute -top-0.5 -right-0.5"
                >
                  <CountBadge n={cartCount} tone="orange" static />
                </motion.span>
              )}
            </IconButton>
            <IconButton label="Open menu" className="lg:hidden" onClick={() => setNavOpen(true)}>
              <Menu aria-hidden className="size-6" strokeWidth={1.75} />
            </IconButton>
          </div>
        </div>
      </header>
      {searchLoaded && <SearchOverlay />}
      {navLoaded && <MobileNav />}
    </>
  );
}

function CountBadge({ n, tone, static: isStatic }: { n: number; tone: "orange" | "navy"; static?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-bold text-white tabular-nums",
        tone === "orange" ? "bg-action-500" : "bg-navy-700",
        !isStatic && "absolute -top-0.5 -right-0.5",
      )}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

const iconCls =
  "relative flex size-11 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-navy-50 hover:text-navy-700";

function IconButton({
  label,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" aria-label={label} title={label} className={cn(iconCls, className)} {...props}>
      {children}
    </button>
  );
}

function IconLink({ href, label, className, children }: { href: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} title={label} className={cn(iconCls, className)}>
      {children}
    </Link>
  );
}
