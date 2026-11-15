import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  Compass,
  ImageIcon,
  Quote,
  TicketCheck,
  Users,
} from "lucide-react";

import { Banner } from "@/components/banner";
import { EventCard, type EventItem } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

async function loadEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.events ?? []);
  } catch {
    return [];
  }
}

/** Start of the current day, so "today" still counts as upcoming. */
function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function eventTime(event: EventItem) {
  const date = new Date(event.eventDate);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

/** Undated events stay visible under "Upcoming" rather than disappearing. */
function isUpcoming(event: EventItem) {
  const time = eventTime(event);
  return time === null || time >= startOfToday().getTime();
}

function EmptyState({
  title,
  message,
  href,
  actionLabel,
}: {
  title: string;
  message: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
      <ImageIcon className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
      <h3 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[#6b7280]">{message}</p>
      <Link href={href} className="mt-6 inline-block">
        <Button className="h-11 gap-2 rounded-lg bg-[#0e7a55] px-5 text-sm font-semibold text-white hover:bg-[#0c6a4a]">
          {actionLabel}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </Link>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold tracking-widest text-[#0e9f6e] uppercase">
        {eyebrow}
      </p>
      <h2 className="font-heading mt-2 text-4xl font-medium text-[#18202d] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-[#4b5563]">{subtitle}</p>
    </div>
  );
}

function ViewAllLink() {
  return (
    <Link
      href="/events"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e7a55] transition-colors hover:text-[#0ea371]"
    >
      View all events
      <ArrowRight className="size-4" />
    </Link>
  );
}

function EventCardGrid({ events }: { events: EventItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event._id ?? index} event={event} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home page — banner, upcoming events, platform features, past events */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Banner />
      <Suspense fallback={<EventsSkeleton />}>
        <HomeEventSections />
      </Suspense>
    </>
  );
}

async function HomeEventSections() {
  const events = await loadEvents();

  const upcoming = events
    .filter(isUpcoming)
    .sort((a, b) => (eventTime(a) ?? Infinity) - (eventTime(b) ?? Infinity))
    .slice(0, 6);

  const past = events
    .filter((event) => {
      const time = eventTime(event);
      return time !== null && time < startOfToday().getTime();
    })
    .sort((a, b) => (eventTime(b) ?? 0) - (eventTime(a) ?? 0))
    .slice(0, 6);

  return (
    <>
      {/* Upcoming Events */}
      <section
        style={{
          background:
            "radial-gradient(50% 40% at 90% 0%, rgba(14, 163, 113, .10) 0%, rgba(14, 163, 113, 0) 70%), var(--paper)",
        }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Save the date"
            title="Upcoming Events"
            subtitle="The next drives, camps and community programs you can be part of — happening soon near you."
          />

          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming events yet"
              message="Check back soon — new events are being added all the time."
              href="/events"
              actionLabel="Browse all events"
            />
          ) : (
            <>
              <EventCardGrid events={upcoming} />
              <div className="mt-8 text-right">
                <ViewAllLink />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Platform features — static content */}
      <section className="border-y border-[#e5e7eb] bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Built for changemakers"
            title="Everything you need to make an impact"
            subtitle="UnityPulse brings volunteers and organizers together on one platform — from discovering a cause to running your own drive."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-[#0ea371]/10 text-[#0e7a55]">
                  <feature.icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section
        style={{
          background:
            "radial-gradient(50% 40% at 8% 0%, rgba(224, 102, 47, .08) 0%, rgba(224, 102, 47, 0) 70%), var(--paper)",
        }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Looking back"
            title="Past Events"
            subtitle="A record of the work this community has already done — every drive and camp that made a difference."
          />

          {past.length === 0 ? (
            <EmptyState
              title="No past events yet"
              message="Once events finish, they show up here so the community can look back on them."
              href="/events"
              actionLabel="Browse all events"
            />
          ) : (
            <>
              <EventCardGrid events={past} />
              <div className="mt-8 text-right">
                <ViewAllLink />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials — static content */}
      <section className="border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Voices of impact"
            title="What the community says"
            subtitle="Organizers and volunteers share what it's like to run and join events on UnityPulse."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex h-full flex-col rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
              >
                <Quote className="size-6 text-[#0ea371]/40" strokeWidth={1.5} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[#4b5563]">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[#f3f4f6] pt-4">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${testimonial.avatarClass}`}
                  >
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-[#18202d]">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-[#6b7280]">{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — static content */}
      <section
        style={{
          background:
            "radial-gradient(50% 40% at 90% 0%, rgba(14, 163, 113, .08) 0%, rgba(14, 163, 113, 0) 70%), var(--paper)",
        }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Need help?"
            title="Frequently asked questions"
            subtitle="Quick answers about joining, creating and managing events on UnityPulse."
          />

          <div className="mx-auto max-w-3xl rounded-xl border border-[#e5e7eb] bg-white px-6 py-4 shadow-sm">
            <Accordion>
              {FAQS.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="font-heading text-base font-semibold text-[#18202d] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#4b5563]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            Still have questions?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#0e7a55] underline-offset-4 hover:underline"
            >
              Create an account
            </Link>{" "}
            and reach out to event organizers directly.
          </p>
        </div>
      </section>
    </>
  );
}

/** Loading skeleton shown while the events fetch is in flight. */
function EventsSkeleton() {
  return (
    <section
      style={{
        background:
          "radial-gradient(50% 40% at 90% 0%, rgba(14, 163, 113, .10) 0%, rgba(14, 163, 113, 0) 70%), var(--paper)",
      }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
        <div className="mb-10">
          <div className="h-4 w-40 animate-pulse rounded bg-[#e5e7eb]" />
          <div className="mt-3 h-10 w-72 animate-pulse rounded bg-[#e5e7eb]" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[#e5e7eb]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-xl border border-[#e5e7eb] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Compass,
    title: "Discover Events",
    description:
      "Find winter warmth drives, tree plantations, blood camps and more — organized by volunteers across all 64 districts.",
  },
  {
    icon: TicketCheck,
    title: "Join in One Click",
    description:
      "Sign up for any event instantly and keep track of everything you have joined under your Joined Events page.",
  },
  {
    icon: CalendarPlus,
    title: "Create & Manage",
    description:
      "Publish your own community events, then edit or remove them anytime from your personal management dashboard.",
  },
  {
    icon: Users,
    title: "Community Powered",
    description:
      "Connect with thousands of active changemakers and grow your impact together, from Dhaka to Sylhet.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Organizing our winter warmth drive used to mean juggling phone calls and Facebook posts. With UnityPulse we published the event in minutes and volunteers signed up the same evening.",
    name: "Rafiq Ahmed",
    role: "Organizer · Winter Warmth Drive, Dhaka",
    initials: "RA",
    avatarClass: "bg-[#0ea371]/10 text-[#0e7a55]",
  },
  {
    quote:
      "I found an emergency blood donation camp two streets away from my university. One click to join — no paperwork, no waiting. It is the easiest way I have ever volunteered.",
    name: "Nusrat Jahan",
    role: "Volunteer · Blood Donation Camp, Chittagong",
    initials: "NJ",
    avatarClass: "bg-[#e0662f]/10 text-[#c2551f]",
  },
  {
    quote:
      "As a student coordinator, the manage dashboard is a lifesaver. I can update the venue or date of our tree plantation events whenever plans change, and everyone sees the latest details.",
    name: "Tanvir Hasan",
    role: "Student Coordinator · Tree Plantation, Sylhet",
    initials: "TH",
    avatarClass: "bg-[#0ea371]/10 text-[#0e7a55]",
  },
] as const;

const FAQS = [
  {
    question: "Do I need an account to browse events?",
    answer:
      "No — anyone can browse all upcoming and past events without an account. You only need to sign in when you want to join an event or create your own.",
  },
  {
    question: "How do I join an event?",
    answer:
      "Open the event's details page and hit Join Event. Your name and email are saved with the event, and it instantly appears on your Joined Events page so you never lose track of it.",
  },
  {
    question: "How do I create my own event?",
    answer:
      "Sign in, go to the Create Event page, and fill in the name, category, date, venue, cover image and description. Once submitted, your event is published for the whole community to discover.",
  },
  {
    question: "Can I edit or delete an event I created?",
    answer:
      "Yes. Every event you create appears on your Manage Events dashboard, where you can update the details or remove the event entirely at any time.",
  },
  {
    question: "Does it cost anything to use UnityPulse?",
    answer:
      "No. Discovering, joining and organizing community events on UnityPulse is completely free for volunteers and organizers.",
  },
  {
    question: "Do all events get published instantly?",
    answer:
      "Events created through the platform may require a quick admin approval before they appear publicly, which keeps the feed safe and relevant for everyone.",
  },
] as const;
