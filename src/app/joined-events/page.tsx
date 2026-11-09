"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard, type EventItem } from "@/components/event-card";
import { authClient } from "@/lib/auth-client";

/** Shape of a document saved by POST /join-event in JoinEvent.tsx. */
interface JoinedEvent extends Omit<EventItem, "_id"> {
    username: string;
    useremail: string;
    /** The event's id — stored as `eventId`, not `_id`. */
    eventId: string;
    _id: string;
}

const JoinedEventsPage = () => {

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    // `useremail` never changes for a session, so this fetch stays stable.
    const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.email) return;

        let cancelled = false;

        const fetchJoinedEvents = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/join-event/${encodeURIComponent(user.email)}`
                );

                if (!res.ok) {
                    throw new Error("Failed to load your joined events");
                }

                const data = await res.json();

                if (!cancelled) {
                    setJoinedEvents(
                        Array.isArray(data) ? (data as JoinedEvent[]) : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"
                    );
                }
            }
        };

        fetchJoinedEvents();

        return () => {
            cancelled = true;
        };
    }, [user?.email]);

    return (
        <section
            className="flex-1"
            style={{
                background:
                    "radial-gradient(50% 40% at 90% 0%, rgba(14, 163, 113, .10) 0%, rgba(14, 163, 113, 0) 70%), var(--paper)",
            }}
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
                <div className="mb-10">
                    <p className="text-sm font-bold tracking-widest text-[#0e9f6e] uppercase">
                        Your tickets
                    </p>
                    <h1 className="font-heading mt-2 text-4xl font-medium text-[#18202d] sm:text-5xl">
                        Joined Events
                    </h1>
                    <p className="mt-3 max-w-xl text-[#4b5563]">
                        All the drives, camps and community programs you have
                        signed up for.
                    </p>
                </div>

                {/* Session still loading */}
                {isPending ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-80 animate-pulse rounded-xl border border-[#e5e7eb] bg-white"
                            />
                        ))}
                    </div>
                ) : !user ? (
                    /* Not logged in */
                    <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
                        <Ticket className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
                        <h2 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
                            Please sign in
                        </h2>
                        <p className="mt-1 text-sm text-[#6b7280]">
                            Sign in to see the events you have joined.
                        </p>
                        <Link href="/sign-in" className="mt-6 inline-block">
                            <Button className="h-11 gap-2 rounded-full bg-[#22b35a] px-6 text-sm font-semibold text-white hover:bg-[#175c35]">
                                Login
                            </Button>
                        </Link>
                    </div>
                ) : error ? (
                    /* Fetch failed */
                    <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
                        <ImageIcon className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
                        <h2 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
                            Something went wrong
                        </h2>
                        <p className="mt-1 text-sm text-[#6b7280]">{error}</p>
                    </div>
                ) : joinedEvents === null ? (
                    /* Session ready, join list still loading */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-80 animate-pulse rounded-xl border border-[#e5e7eb] bg-white"
                            />
                        ))}
                    </div>
                ) : joinedEvents.length === 0 ? (
                    /* Logged in, nothing joined yet */
                    <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
                        <Ticket className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
                        <h2 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
                            No joined events yet
                        </h2>
                        <p className="mt-1 text-sm text-[#6b7280]">
                            Browse upcoming events and hit “Join Event” to see
                            them here.
                        </p>
                        <Link href="/events" className="mt-6 inline-block">
                            <Button className="h-11 gap-2 rounded-full bg-[#22b35a] px-6 text-sm font-semibold text-white hover:bg-[#175c35]">
                                Browse Events
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* Joined events grid — cards link back to the event details page */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {joinedEvents.map((joined) => (
                            <EventCard
                                key={joined._id}
                                event={
                                    {
                                        ...joined,
                                        // the card links to /events/<eventId>,
                                        // not the join document's own _id
                                        _id: joined.eventId,
                                    } as EventItem
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default JoinedEventsPage;
