"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";

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

const EVENT_CATEGORIES = [
  "Environment",
  "Education",
  "Health",
  "Community Service",
  "Fundraiser",
  "Other",
] as const;

function RequiredLabel({ children }: { children: string }) {
  return (
    <Label className="font-semibold">
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

const initialForm = {
  eventName: "",
  category: "",
  eventDate: "",
  fullAddress: "",
  imageUrl: "",
  description: "",
};

export default function CreatEvent() {
  const [form, setForm] = useState(initialForm);

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
    // console.log("Create Event", form);

    const res = await fetch("http://localhost:8000/add-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("Response from server:", data);}

  // console.log(form);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-widest text-green-600 uppercase">
              Make an Impact
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create a Community Event
            </h1>
            <p className="text-muted-foreground">
              Bring people together, make a difference, and create positive
              change in your community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Event Schedule & Location */}
            <section className="flex flex-col gap-5">
              
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
                className={cn(
                  "h-11 w-full bg-green-600 text-base text-white hover:bg-green-700"
                )}
              >
                Create Event
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Your event may require admin approval before being published.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
