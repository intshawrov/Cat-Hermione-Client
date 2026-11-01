"use client";

import { CalendarDays, LogIn, Menu, Moon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#18202d14] bg-white font-sans">
      {/* Desktop bar */}
      <div className="mx-auto hidden h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-green-800">
              <span className="size-3.5 rounded-full border-2 border-white" />
            </span>
            <span className="text-xl font-bold text-[#18202d]">ImpactBD</span>
          </div>
        </div>

        {/* Center nav link */}
        <a
          href="#upcoming-events"
          className="flex items-center gap-2 text-sm font-semibold text-[#55606e] hover:text-green-800"
        >
          <CalendarDays className="size-4" />
          Upcoming Events
        </a>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle theme"
            className="grid size-9 place-items-center rounded-full border border-[#e7e2d7] bg-zinc-100 text-[#18202d] transition-colors hover:bg-zinc-200"
          >
            <Moon className="size-4" />
          </button>
          <Button className="h-10 gap-2 rounded-full bg-[#22b35a] px-6 text-sm font-semibold text-white hover:bg-[#175c35]">
            <LogIn data-icon="size-4 shrink-0" />
            Login
          </Button>
        </div>
      </div>

      {/* Mobile bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-green-800">
            <span className="size-3.5 rounded-full border-2 border-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[#18202d]">
            ImpactBD
          </span>
        </div>

        <div className="flex items-center gap-2">
   
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid size-10 place-items-center rounded-full bg-zinc-100 text-[#18202d] transition-colors hover:bg-zinc-200"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-50 lg:hidden">
          {/* Blur backdrop: header er niche theke shuru, click korle menu bondho */}
          <div
            className="absolute inset-x-0 top-0 h-[100dvh] bg-black/20 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="relative px-4 pt-1 pb-4">
            <div className="grid gap-2 rounded-xl border border-[#18202d14] bg-zinc-50 p-2 shadow-lg">
              <a
                href="#upcoming-events"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 items-center gap-2.5 rounded-lg border border-[#18202d14] bg-white px-3 text-sm font-semibold text-[#18202d]"
              >
                <CalendarDays className="size-4 text-green-700" />
                Upcoming Events
              </a>

              <button
                type="button"
                className="flex h-11 items-center justify-between rounded-lg border border-[#18202d14] bg-white px-3 text-sm font-semibold text-[#18202d]"
              >
                Theme
                <Moon className="size-4" />
              </button>

              <div className="my-1 border-t border-[#18202d14]" />

              <Button className="h-11 w-full gap-2 rounded-full bg-[#1a6b3e] px-5 text-sm font-semibold text-white hover:bg-[#175c35]">
                <LogIn data-icon="inline-start" />
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
