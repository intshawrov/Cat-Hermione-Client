"use client";

import { PrivateRoute } from "@/components/private-route";

function JoinManagementContent() {
    return (
        <div>
            hello
        </div>
    );
}

export default function JoinManagementPage() {
    return (
        <PrivateRoute>
            <JoinManagementContent />
        </PrivateRoute>
    );
}
