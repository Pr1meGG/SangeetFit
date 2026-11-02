"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, Menu, X, Zap } from "lucide-react";

type Mode = "mock" | "live" | "unconfigured";
export type NavigationView = "home" | "clothes" | "shortlist" | "try-on" | "how-it-works" | "faq";

interface Props {
  activeView?: NavigationView | "collection";
  onNavigate?: (view: NavigationView) => void;
  shortlistCount?: number;
}

const NAV_ITEMS = [
  { view: "home", label: "For you", href: "/" },
  { view: "collection", label: "Collection", href: "/library" },
  { view: "clothes", label: "My wardrobe", href: "/?step=3&view=clothes" },
  { view: "shortlist", label: "Shortlist", href: "/?step=3&view=shortlist" },
  { view: "how-it-works", label: "How it works", href: "/#how-it-works" },
  { view: "faq", label: "FAQ", href: "/#faq" },
] as const;

const MODE_LABELS: Record<Mode, { text: string; className: string; icon: "zap" | "cpu" }> = {
  live: { text: "Live AI", className: "text-[#35634C]", icon: "zap" },
  mock: { text: "Mock Mode", className: "text-[#805522]", icon: "zap" },
  unconfigured: { text: "API Not Configured", className: "text-[#78665E]", icon: "cpu" },
};

export default function Navbar({ activeView = "home", onNavigate, shortlistCount = 0 }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/mode", { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("Mode unavailable");
        return res.json();
      })
      .then((data: { mode?: string }) => {
        if (controller.signal.aborted) return;
        if (data.mode === "mock" || data.mode === "live" || data.mode === "unconfigured") {
          setMode(data.mode);
        } else {
          setMode("unconfigured");
        }
      })
      .catch(() => { if (!controller.signal.aborted) setMode("unconfigured"); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) close();
    };
    const desktop = window.matchMedia("(min-width: 1100px)");
    const resize = () => { if (desktop.matches) close(); };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("popstate", close);
    window.addEventListener("hashchange", close);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("popstate", close);
      window.removeEventListener("hashchange", close);
      desktop.removeEventListener("change", resize);
    };
  }, [menuOpen]);

  const label = mode ? MODE_LABELS[mode] : null;
  const modeBadge = <span role="status" data-mode={mode ?? "checking"} className={`sf-mode ${label?.className ?? "text-[#78665E]"}`}>
    {label?.icon === "zap" ? <Zap className="h-3 w-3" aria-hidden="true" /> : <Cpu className="h-3 w-3" aria-hidden="true" />}
    {label?.text ?? "Checking…"}
  </span>;

  const navigate = (view: NavigationView) => {
    onNavigate?.(view);
    setMenuOpen(false);
  };
  const closeAfterLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!event.defaultPrevented) setMenuOpen(false);
  };
  const navLinks = (mobile = false) => NAV_ITEMS.map(item => {
    const current = activeView === item.view;
    const className = `${mobile ? "sf-mobile-link" : "sf-nav-link"}${current ? " is-active" : ""}`;
    const content = <>{item.label}{item.view === "shortlist" && shortlistCount > 0 && <span className="sf-nav-count">{shortlistCount}</span>}</>;
    return onNavigate && item.view !== "collection"
      ? <button type="button" key={item.view} className={className} aria-current={current ? "page" : undefined} onClick={() => navigate(item.view)}>{content}</button>
      : <Link key={item.view} href={item.href} className={className} aria-current={current ? "page" : undefined} onClick={closeAfterLink}>{content}</Link>;
  });
  const tryOnAction = onNavigate
    ? <button type="button" className="sf-nav-cta" aria-current={activeView === "try-on" ? "page" : undefined} onClick={() => navigate("try-on")}>Try on a look <ArrowUpRight size={16} aria-hidden="true" /></button>
    : <Link href="/?step=3&view=try-on" className="sf-nav-cta" onClick={closeAfterLink}>Try on a look <ArrowUpRight size={16} aria-hidden="true" /></Link>;

  return (
    <header ref={headerRef} className="sf-navbar sticky top-0 z-50">
      <nav aria-label="Main navigation" className="sf-navbar-inner">
        <Link href="/" className="sf-brand" onClick={event => {
          if (event.defaultPrevented) return;
          if (onNavigate && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            navigate("home");
          } else closeAfterLink(event);
        }}>
          <img src="/brand/logo-symbol.svg" alt="" className="h-10 w-10 rounded-xl" width={40} height={40} />
          <span className="sf-brand-copy">
            <span className="sf-wordmark">SangeetFit</span>
          </span>
        </Link>
        <div className="sf-nav-links">{navLinks()}</div>
        <div className="sf-navbar-state">
          {modeBadge}
          {tryOnAction}
        </div>
        <button ref={toggleRef} type="button" className="sf-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="sf-mobile-menu" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
      </nav>
      {menuOpen && <span className="sf-menu-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      {menuOpen && <nav id="sf-mobile-menu" className="sf-mobile-menu" aria-label="Mobile navigation">
        {navLinks(true)}
        <div className="sf-mobile-footer">{modeBadge}{tryOnAction}</div>
      </nav>}
    </header>
  );
}
