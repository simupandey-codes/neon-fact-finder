import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/detect", label: "Detect" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (light) root.classList.add("light");
    else root.classList.remove("light");
  }, [light]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="size-7 text-[color:var(--neon)] group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 blur-md bg-[color:var(--neon)] opacity-50 -z-10" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Truth<span className="text-gradient">Lens</span> AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "text-foreground bg-[color:color-mix(in_oklab,var(--neon)_15%,transparent)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLight((v) => !v)} aria-label="Toggle theme">
            {light ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="px-3 py-2 rounded-md hover:bg-secondary text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} TruthLens AI · Student Project Prototype</p>
        <p>Built with React, TanStack Start & Tailwind</p>
      </div>
    </footer>
  );
}
