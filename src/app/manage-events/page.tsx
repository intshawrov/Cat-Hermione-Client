"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard, type EventItem } from "@/components/event-card";
import { authClient } from "@/lib/auth-client";
import { PrivateRoute } from "@/components/private-route";
import EditEvent, { type EditableEvent } from "@/components/editEvent";
import DeleteEvent from "@/components/deleteEvent";

function ManageEventsContent() {

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [myEvents, setMyEvents] = useState<EventItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const reload = () => setReloadKey((key) => key + 1);

    useEffect(() => {
        if (!user?.email) return;

        let cancelled = false;

        const fetchMyEvents = async () => {
            try {
                const res = await fetch("http://localhost:8000/events");

                if (!res.ok) {
                    throw new Error("Failed to load your events");
                }

                const data = await res.json();
                const events: EventItem[] = Array.isArray(data)
                    ? data
                    : (data?.events ?? []);

                if (!cancelled) {
                    // Only events created by the logged-in user. Events created
                    // before ownership tracking has no creatorEmail and can't
                    // be managed.
                    setMyEvents(
                        events.filter(
                            (event) => event.creatorEmail === user.email
                        )
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

        fetchMyEvents();

        return () => {
            cancelled = true;
        };
    }, [user?.email, reloadKey]);

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
                        Organizer dashboard
                    </p>
                    <h1 className="font-heading mt-2 text-4xl font-medium text-[#18202d] sm:text-5xl">
                        Manage Events
                    </h1>
                    <p className="mt-3 max-w-xl text-[#4b5563]">
                        Edit or delete the community events you have created.
                    </p>
                </div>

                {error ? (
                    /* Fetch failed */
                    <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
                        <ImageIcon className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
                        <h2 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
                            Something went wrong
                        </h2>
                        <p className="mt-1 text-sm text-[#6b7280]">{error}</p>
                    </div>
                ) : myEvents === null ? (
                    /* Event list still loading */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-96 animate-pulse rounded-xl border border-[#e5e7eb] bg-white"
                            />
                        ))}
                    </div>
                ) : myEvents.length === 0 ? (
                    /* No events created yet */
                    <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
                        <PlusCircle className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
                        <h2 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
                            You haven&apos;t created any events yet
                        </h2>
                        <p className="mt-1 text-sm text-[#6b7280]">
                            Events you create will appear here so you can edit
                            or delete them.
                        </p>
                        <Link href="/creat-event" className="mt-6 inline-block">
                            <Button className="h-11 gap-2 rounded-full bg-[#22b35a] px-6 text-sm font-semibold text-white hover:bg-[#175c35]">
                                Create Event
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* Grid of owned events with Edit / Delete actions */
                    <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {myEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                actions={
                                    <>
                                        <EditEvent
                                            event={event as EditableEvent}
                                            onSaved={reload}
                                        />
                                        <DeleteEvent
                                            eventId={event._id ?? ""}
                                            onDeleted={reload}
                                        />
                                    </>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default function ManageEventsPage() {
    return (
        <PrivateRoute>
            <ManageEventsContent />
        </PrivateRoute>
    );
}
