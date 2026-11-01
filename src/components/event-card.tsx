import { ArrowRight, CalendarDays, ImageIcon, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface EventItem {
  eventName: string;
  category: string;
  eventDate: string;
  fullAddress: string;
  imageUrl: string;
  description: string;
}

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

function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e7a55] transition-colors group-hover:text-[#0ea371]">
            View details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export { EventCard };
