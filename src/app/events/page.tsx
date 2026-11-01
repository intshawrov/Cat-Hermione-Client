import { EventCard } from "@/components/event-card";
import type { EventItem } from "@/components/event-card";
import { ImageIcon } from "lucide-react";

const AllEvents = async () => {
  const res = await fetch("http://localhost:8000/events");
  const data = await res.json();
  const events: EventItem[] = Array.isArray(data) ? data : (data?.events ?? []);
  console.log(data);

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
            What&apos;s happening near you
          </p>
          <h1 className="font-heading mt-2 text-4xl font-medium text-[#18202d] sm:text-5xl">
            All Events
          </h1>
          <p className="mt-3 max-w-xl text-[#4b5563]">
            Browse drives, camps and community programs organized by volunteers across the country.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-20 text-center">
            <ImageIcon className="mx-auto size-10 text-[#9ca3af]" strokeWidth={1.5} />
            <h2 className="font-heading mt-4 text-lg font-semibold text-[#18202d]">
              No events yet
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Check back soon — new events are being added all the time.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllEvents;
