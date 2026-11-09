import Link from "next/link";
import { ArrowRight, CalendarDays, ImageIcon, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export interface EventItem {
  eventName: string;
  category: string;
  eventDate: string;
  fullAddress: string;
  imageUrl: string;
  description: string;
  /** Present on events fetched from the API — makes the card a link to its details page. */
  _id?: string;
  /** Creator identity stored by the create-event form. Older events have neither. */
  creatorEmail?: string;
  creatorName?: string;
}

type EventCardProps = {
  event: EventItem;
  /**
   * Optional action bar (e.g. Edit/Delete triggers) rendered *below* the card,
   * outside the click-to-details area. Used only on /manage-events — passing
   * it restructures the card so buttons are never nested inside the Link.
   */
  actions?: ReactNode;
};

function formatDate(value: string) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const cardClasses =
  "group flex h-full flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg";

function EventCardContent({ event }: { event: EventItem }) {
  return (
    <>
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.eventName || "Event cover"}
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-[linear-gradient(135deg,rgba(14,163,113,0.08),rgba(224,102,47,0.08))]">
            <ImageIcon className="size-10 text-[#9ca3af]" strokeWidth={1.5} />
          </div>
        )}

        {event.category ? (
          <Badge className="absolute top-3 left-3 h-6 rounded-full bg-white/95 px-3 text-xs font-semibold text-[#0e7a55] shadow-sm backdrop-blur">
            {event.category}
          </Badge>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-[#0e7a55]">
          <CalendarDays className="size-4" />
          {formatDate(event.eventDate)}
        </div>

        <h3 className="font-heading text-lg leading-snug font-semibold text-[#18202d]">
          {event.eventName || "Untitled event"}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-[#6b7280]">
          <MapPin className="size-4 shrink-0 text-[#e0662f]" />
          <span className="truncate">{event.fullAddress || "Location to be announced"}</span>
        </p>

        {event.description ? (
          <p className="text-sm leading-relaxed text-[#4b5563] line-clamp-3">
            {event.description}
          </p>
        ) : null}

        <div className="mt-auto pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e7a55] transition-colors group-hover:text-[#0ea371]">
            View details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </>
  );
}

function EventCard({ event, actions }: EventCardProps) {
  // The whole card is the click target when linked (client-side navigation,
  // prefetch, middle-click/new-tab all work); without an id it stays a
  // plain card.
  const linkedCard = event._id ? (
    <Link
      href={`/events/${event._id}`}
      className={`${cardClasses} block cursor-pointer outline-none focus-visible:border-[#0ea371]/60 focus-visible:ring-3 focus-visible:ring-[#0ea371]/20`}
    >
      <EventCardContent event={event} />
    </Link>
  ) : (
    <article className={cardClasses}>
      <EventCardContent event={event} />
    </article>
  );

  // With an action bar (manage-events), the interactive row must sit OUTSIDE
  // the link/dialog markup, so the card is composed as: linkable visual card
  // + separate actions row. Without actions the existing layout is unchanged.
  if (actions) {
    return (
      <div className="flex h-full flex-col gap-2.5">
        {linkedCard}
        <div className="flex gap-2">{actions}</div>
      </div>
    );
  }

  return linkedCard;
}

export { EventCard };
