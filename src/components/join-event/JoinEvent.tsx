// "use client";
// import { useState } from "react";
// import { Badge } from '../ui/badge';
// import {
//     CalendarDays,
//     MapPin,
//     Share2,
//     Ticket,
// } from "lucide-react";
// import { Button } from '@base-ui/react';
// import { authClient } from '@/lib/auth-client';

// interface EventDetails {
//     _id: string;
//     eventName: string;
//     category: string;
//     eventDate: string;
//     fullAddress: string;
//     imageUrl: string;
//     description: string;
// }

// function formatDate(value: string) {
//     if (!value) return "Date to be announced";
//     const date = new Date(value);
//     if (Number.isNaN(date.getTime())) return value;
//     return date.toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//     });
// }

// const JoinEvent = ({ event }: { event: EventDetails }) => {
//     const { data: session } = authClient.useSession();
//     const user = session?.user;

//     const handleJoinEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();

//         if (!user) {
//             console.log("Please login first!");
//             return;
//         }

//         const data = {
//             username: user.name,
//             useremail: user.email,
//             ...event,
//         };

//         console.log("Joined Event Data:", data);
//     }

//     const joinEvent = async () => {
//     const res = await fetch("http://localhost:8000/join-event", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     });

//     const result = await res.json();

//     console.log(result);
// };

//         return (
//             <aside className="w-full shrink-0 lg:w-88">
//                 <div className="sticky top-6 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
//                     <Badge
//                         variant="outline"
//                         className="h-6 rounded-full border-[#0ea371]/20 bg-[#0ea371]/10 px-3 text-xs font-semibold text-[#0e7a55]"
//                     >
//                         {event.category || "Event"}
//                     </Badge>

//                     <h2 className="font-heading mt-4 text-xl leading-snug font-semibold text-[#18202d]">
//                         {event.eventName || "Untitled event"}
//                     </h2>

//                     <div className="mt-5 space-y-3 border-t border-[#e5e7eb] pt-5 text-sm">
//                         <div className="flex items-start gap-3">
//                             <CalendarDays className="size-4 shrink-0 text-[#0e7a55]" />
//                             <div className="leading-5 text-[#4b5563]">
//                                 <span className="font-medium text-[#18202d]">When</span>
//                                 <br />
//                                 {formatDate(event.eventDate)}
//                             </div>
//                         </div>
//                         <div className="flex items-start gap-3">
//                             <MapPin className="size-4 shrink-0 text-[#e0662f]" />
//                             <div className="leading-5 text-[#4b5563]">
//                                 <span className="font-medium text-[#18202d]">Where</span>
//                                 <br />
//                                 {event.fullAddress || "Location to be announced"}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-6 flex w-full flex-col gap-2.5">
//                         <Button
//                             type="button"
//                             onClick={handleJoinEvent}
//                             className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22b35a] text-sm font-semibold text-white hover:bg-[#0c6a4a] cursor-pointer"
//                         >
//                             Join Event
//                             <Ticket className="size-4" />
//                         </Button>

//                         <Button
//                             variant="outline"
//                             className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white text-sm font-semibold text-[#18202d] hover:bg-zinc-50"
//                         >
//                             Share
//                             <Share2 className="size-4" />
//                         </Button>
//                     </div>

//                     <p className="mt-4 text-center text-xs text-[#6b7280]">
//                         Free to join — no account needed to browse.
//                     </p>
//                 </div>
//             </aside>
//         );
//     };

//     export default JoinEvent;




"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import {
    CalendarDays,
    MapPin,
    Share2,
    Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

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

const JoinEvent = ({ event }: { event: EventDetails }) => {

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(false);

    const handleJoinEvent = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        if (!user) {
            console.log("Please login first!");
            return;
        }

        if (joined) {
            console.log("You have already joined this event!");
            return;
        }

        const data = {
            username: user.name,
            useremail: user.email,
            ...event,
        };

        try {
            setLoading(true);

            const res = await fetch(
                "http://localhost:8000/join-event",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to join event");
            }

            const result = await res.json();

            console.log("Successfully joined event!", result);

            setJoined(true);

        } catch (error) {
            console.error("Error joining event:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="w-full shrink-0 lg:w-88">
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
                            <span className="font-medium text-[#18202d]">
                                When
                            </span>
                            <br />
                            {formatDate(event.eventDate)}
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="size-4 shrink-0 text-[#e0662f]" />

                        <div className="leading-5 text-[#4b5563]">
                            <span className="font-medium text-[#18202d]">
                                Where
                            </span>
                            <br />
                            {event.fullAddress || "Location to be announced"}
                        </div>
                    </div>

                </div>

                <div className="mt-6 flex w-full flex-col gap-2.5">

                    <Button
                        type="button"
                        onClick={handleJoinEvent}
                        disabled={loading || joined}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22b35a] text-sm font-semibold text-white hover:bg-[#0c6a4a] cursor-pointer disabled:opacity-60"
                    >
                        {loading
                            ? "Joining..."
                            : joined
                                ? "Joined Successfully"
                                : "Join Event"
                        }

                        <Ticket className="size-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white text-sm font-semibold text-[#18202d] hover:bg-zinc-50"
                    >
                        Share
                        <Share2 className="size-4" />
                    </Button>

                </div>

                <p className="mt-4 text-center text-xs text-[#6b7280]">
                    Free to join — no account needed to browse.
                </p>

            </div>
        </aside>
    );
};

export default JoinEvent;
