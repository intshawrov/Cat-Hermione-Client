import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    Delete,
    ImageIcon,
    MapPin,
    Share2,
    Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditEvent from "@/components/editEvent";
import DeleteEvent from "@/components/deleteEvent";
import JoinEvent from "@/components/join-event/JoinEvent";

interface EventDetails {
    _id: string;
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
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

const EventDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const res = await fetch(`http://localhost:8000/events/${id}`);
    if (!res.ok) {
        notFound();
    }
    const event = (await res.json()) as EventDetails;
    if (!event?._id) {
        notFound();
    }
    console.log(event);

    return (
        <section
            className="flex-1"
            style={{
                background:
                    "radial-gradient(50% 40% at 90% 0%, rgba(14, 163, 113, .10) 0%, rgba(14, 163, 113, 0) 70%), var(--paper)",
            }}
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14">
                {/* Back link */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#4b5563] transition-colors hover:text-[#0e7a55]"
                    >
                        <ArrowLeft className="size-4" />
                        Back to all events
                    </Link>

                   <div className="flex gap-2">
                     <EditEvent event={event} />
                    <DeleteEvent eventId={event._id} />
                   </div>
                </div>
                {/* Hero cover */}
                <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-zinc-100 shadow-sm">
                    {event.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={event.imageUrl}
                            alt={event.eventName || "Event cover"}
                            className="aspect-[21/9] w-full object-cover object-center max-sm:aspect-[4/3]"
                        />
                    ) : (
                        <div className="flex aspect-[21/9] w-full items-center justify-center bg-[linear-gradient(135deg,rgba(14,163,113,0.08),rgba(224,102,47,0.08))] max-sm:aspect-[4/3]">
                            <ImageIcon className="size-12 text-[#9ca3af]" strokeWidth={1.5} />
                        </div>
                    )}
                    {/* Scrim */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18202d]/70 via-transparent to-transparent max-sm:hidden" />
                    {event.category ? (
                        <Badge className="absolute top-4 left-4 h-7 rounded-full bg-white/95 px-3.5 text-xs font-semibold text-[#0e7a55] shadow-sm backdrop-blur">
                            {event.category}
                        </Badge>
                    ) : null}
                </div>

                {/* Body */}
                <div className="mt-10 flex items-start gap-10 max-lg:flex-col">
                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                        <h1 className="font-heading text-3xl leading-tight font-medium text-[#18202d] sm:text-5xl sm:leading-[1.15]">
                            {event.eventName || "Untitled event"}
                        </h1>

                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[#4b5563]">
                            <span className="inline-flex items-center gap-2 text-sm font-medium">
                                <CalendarDays className="size-4 text-[#0e7a55]" />
                                {formatDate(event.eventDate)}
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm font-medium">
                                <MapPin className="size-4 text-[#e0662f]" />
                                {event.fullAddress || "Location to be announced"}
                            </span>
                        </div>

                        {event.description ? (
                            <div className="mt-10 border-t border-[#e5e7eb] pt-8">
                                <h2 className="font-heading text-xl font-semibold text-[#18202d]">
                                    About this event
                                </h2>
                                <p className="mt-4 leading-relaxed whitespace-pre-line text-[#4b5563]">
                                    {event.description}
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/* Sidebar */}

                        <JoinEvent event={event} />

                    {/* <aside className="w-full shrink-0 lg:w-88">
                        <div className="sticky top-6 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                            <Badge
                                variant="outline"
                                className="h-6 rounded-full border-[#0ea371]/20 bg-[#0ea371]/10 px-3 text-xs font-semibold text-[#0e7a55]"
                            >
                                {event.category || "Event"}
                            </Badge>

                            <h2 className="font-heading mt-4 text-xl leading-snug font-semibold text-[#18202d]">
                                {event.eventName || "Untitled event"}
                            </h2>

                            <div className="mt-5 space-y-3 border-t border-[#e5e7eb] pt-5 text-sm">
                                <div className="flex items-start gap-3">
                                    <CalendarDays className="size-4 shrink-0 text-[#0e7a55]" />
                                    <div className="leading-5 text-[#4b5563]">
                                        <span className="font-medium text-[#18202d]">When</span>
                                        <br />
                                        {formatDate(event.eventDate)}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="size-4 shrink-0 text-[#e0662f]" />
                                    <div className="leading-5 text-[#4b5563]">
                                        <span className="font-medium text-[#18202d]">Where</span>
                                        <br />
                                        {event.fullAddress || "Location to be announced"}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2.5">
                                <Button className="h-11 gap-2 rounded-lg bg-[#22b35a] text-sm font-semibold text-white hover:bg-[#0c6a4a]">
                                    Join Event
                                    <Ticket data-icon="inline-end" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 gap-2 rounded-lg border-[#e5e7eb] text-sm font-semibold text-[#18202d] hover:bg-zinc-50"
                                >
                                    Share
                                    <Share2 data-icon="inline-end" />
                                </Button>
                            </div>

                            <p className="mt-4 text-center text-xs text-[#6b7280]">
                                Free to join — no account needed to browse.
                            </p>
                        </div>
                    </aside> */}
                </div>
            </div>
        </section>
    );
};

export default EventDetailsPage;
