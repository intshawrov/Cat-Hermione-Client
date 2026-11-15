"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export function PrivateRoute({ children }: { children: ReactNode }) {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isPending || user) return;

        router.replace(
            `/sign-in?redirect=${encodeURIComponent(pathname)}`
        );
    }, [isPending, user, router, pathname]);

    // Still resolving the session, or a guest being redirected away.
    if (isPending || !user) {
        return null;
    }

    return <>{children}</>;
}
