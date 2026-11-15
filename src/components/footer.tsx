import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { href: "/events", label: "All Events" },
  { href: "/creat-event", label: "Create Event" },
  { href: "/joined-events", label: "Joined Events" },
  { href: "/manage-events", label: "Manage Events" },
];

const ACCOUNT_LINKS = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Create Account" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[#18202d] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6">
        {/* Top — brand + link columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#0ea371]">
                <span className="size-3.5 rounded-full border-2 border-white" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                ImpactBD
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              The community impact network for Bangladesh — discover, join and
              organize drives, camps and programs that make a real difference
              across all 64 districts.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#34d399]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account links */}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Get Started
            </h3>
            <ul className="mt-4 space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#34d399]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <CalendarDays className="size-4 text-[#34d399]" />
              <MapPin className="size-4 text-[#e0662f]" />
              Built for volunteers, nationwide
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © 2026 ImpactBD · Cat Hermione. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            No account needed to browse — join in and make an impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
