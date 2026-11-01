import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Banner() {
  return (
    <section
      style={{
        background:
          "radial-gradient(56% 60% at 84% 42%, rgba(14, 163, 113, .13) 0%, rgba(14, 163, 113, 0) 70%), radial-gradient(40% 40% at 6% 92%, rgba(224, 102, 47, .10) 0%, rgba(224, 102, 47, 0) 70%), var(--paper)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-[#0e9f6e]">
          Community Impact Network
        </p>
        <h1 className="font-heading mt-6 text-5xl leading-tight font-medium text-[#18202d] sm:text-7xl sm:leading-[1.15]">
          Be the Change.
          <br />
          <em className="italic text-[#0ea371]">Build a Better Bangladesh.</em>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#4b5563]">
          Join thousands of active changemakers organizing winter warmth drives, tree plantations, emergency blood camps, and youth mentorship across Dhaka, Chittagong, Sylhet, and all 64 districts.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button className="h-11 gap-2 rounded-lg bg-[#0e7a55] px-5 text-sm font-semibold text-white hover:bg-[#0c6a4a]">
            Browse Events
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button className="h-11 rounded-lg bg-[#18202d] px-5 text-sm font-semibold text-white hover:bg-[#232c3d]">
            Join as a Volunteer
          </Button>
          <Button className="h-11 rounded-lg border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#18202d] hover:bg-zinc-50">
            Sign up your Organization
          </Button>
        </div>
        <p className="mt-4 text-sm text-[#6b7280]">
          No account needed to browse.
        </p>
      </div>
    </section>
  );
}

export { Banner };
