"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Real auth guard for private pages.
 *
 * While the session is being resolved nothing is rendered (no content flash
 * for guests), and a userless session is redirected to /sign-in with a
 * `redirect` param so the user lands back on the page they wanted.
 *
 * This is the layer that actually enforces privacy: it round-trips to
 * /api/auth and validates a cryptographically signed session, unlike the
 * optimistic cookie check in src/proxy.ts. Use them together.
 */
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
