"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, Pencil } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface EditableEvent {
  eventName: string;
  category: string;
  eventDate: string;
  fullAddress: string;
  imageUrl: string;
  description: string;
  /** Required — the event is updated by id. */
  _id: string;
}

const EVENT_CATEGORIES = [
  "Environment",
  "Education",
  "Health",
  "Community Service",
  "Fundraiser",
  "Other",
] as const;

// Allowed form fields to avoid passing the event's API-only fields to the server.
function toForm(event: EditableEvent) {
  return {
    eventName: event.eventName ?? "",
    category: event.category ?? "",
    eventDate: event.eventDate ?? "",
    fullAddress: event.fullAddress ?? "",
    imageUrl: event.imageUrl ?? "",
    description: event.description ?? "",
  };
}

type FormState = ReturnType<typeof toForm>;

function RequiredLabel({ children }: { children: string }) {
  return (
    <Label className="font-semibold">
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

interface EditEventProps {
  event: EditableEvent;
  /** Optional callback fired after a successful save — lets client-fetched
   * lists (e.g. /manage-events) re-fetch and show fresh data. */
  onSaved?: () => void;
}

function EditEvent({ event, onSaved }: EditEventProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => toForm(event));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<null | "saved" | "error">(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: unknown) => {
    setForm((prev) => ({ ...prev, category: String(value ?? "") }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    // The form never contains the event's `_id`, so the PATCH body is safe
    // to send as-is (the id goes in the URL).
    const updatedData = { ...form };

    try {
      const res = await fetch(`http://localhost:8000/events/${event._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      // Re-render server components (event details) with fresh data.
      router.refresh();
      // Let client-fetched lists refresh themselves if a callback was given.
      onSaved?.();
      setStatus("saved");
      setOpen(false);
    } catch (err) {
      console.error("Failed to update event:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (!event?._id) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="gap-2 border-[#e5e7eb] bg-white/95 text-[#18202d] shadow-sm backdrop-blur hover:bg-white hover:text-[#18202d]"
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pr-4">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the event details below, then save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          {/* Basic Information */}
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Basic Information
              </h2>
              <Separator />
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel>Event Name</RequiredLabel>
              <Input
                name="eventName"
                className="h-10"
                placeholder="e.g. Community Tree Plantation"
                value={form.eventName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <RequiredLabel>Event Category</RequiredLabel>
                <Select value={form.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-10 w-full md:rounded-lg">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="md:rounded-lg">
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <RequiredLabel>Event Date</RequiredLabel>
                <Input
                  type="date"
                  name="eventDate"
                  className="h-10"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Event Schedule & Location */}
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Schedule &amp; Location
              </h2>
              <Separator />
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel>Full Address</RequiredLabel>
              <Input
                name="fullAddress"
                className="h-10"
                placeholder="Enter event venue address"
                value={form.fullAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel>Event Image URL</RequiredLabel>
              <Input
                type="url"
                name="imageUrl"
                className="h-10"
                placeholder="https://example.com/event-image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                Paste your event cover image URL here (JPG, PNG or WEBP).
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <RequiredLabel>Description</RequiredLabel>
              <Textarea
                name="description"
                className="min-h-28"
                placeholder="Describe your event and its purpose..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={saving}
              className={cn(
                "h-11 w-full bg-green-600 text-base text-white hover:bg-green-700"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
              {!saving && <ArrowRightIcon data-icon="inline-end" />}
            </Button>
            {status === "error" ? (
              <p className="text-sm text-red-600">
                Something went wrong while saving. Please try again.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Changes take effect immediately after saving.
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditEvent;
