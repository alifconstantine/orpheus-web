"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X, ArrowDownToLine } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const NAV_ITEMS = [
  { label: "Features", href: "/#features" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Compare", href: "/#comparison" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidHeader = scrolled || mobileOpen || pathname !== "/";

  return (
    <header className="or-header" data-scrolled={solidHeader}>
      <div className="or-header-inner">
        <Link href="/" className="or-brand" aria-label="Orpheus Home">
          <img
            src="/images/rounded-app-icon.png"
            alt="Orpheus"
            width={28}
            height={28}
            className="h-7 w-7 rounded-lg object-cover"
          />
          <span>Orpheus</span>
        </Link>

        <nav className="or-nav" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="or-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="or-header-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="or-icon-btn"
            aria-label={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mounted && theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <Link href="/download" className="or-header-cta">
            <ArrowDownToLine size={14} />
            <span>Download</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="or-icon-btn or-menu-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-x-0 top-[70px] z-50 border-b border-[var(--or-line)] bg-[var(--or-canvas)]/95 px-6 py-5 backdrop-blur-xl lg:hidden"
          style={{ color: "var(--or-ink)" }}
        >
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-[15px] font-medium hover:bg-[var(--or-surface-muted)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/download"
              onClick={() => setMobileOpen(false)}
              className="or-button or-button-primary mt-2 w-full justify-center"
            >
              Download Orpheus
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
