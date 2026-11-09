"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface DeleteEventProps {
    eventId: string;
    /** Optional callback — replaces the default redirect to /events with a
     * caller-provided refresh (used by /manage-events). */
    onDeleted?: () => void;
}

const DeleteEvent = ({ eventId, onDeleted }: DeleteEventProps) => {
    const router = useRouter();
    const handleEventDelete = async () => {
        const res = await fetch(`http://localhost:8000/events/${eventId}`, {
            method: "DELETE",
        });
        const data = await res.json();

        console.log(data);

        if (onDeleted) {
            // Stay on the calling page and let it re-fetch its list.
            onDeleted();
        } else {
            router.push("/events");
        }

        router.refresh();
    }
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger
                    render={<Button variant="outline" />}
                >
                    Delete Event
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleEventDelete}>
                            <Trash2 />
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DeleteEvent;