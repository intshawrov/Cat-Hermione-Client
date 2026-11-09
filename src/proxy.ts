import { NextResponse, type NextRequest } from "next/server";

// better-auth's default session cookie. On HTTPS it gets a
// "__Secure-" cookie prefix, so match both variants.
const SESSION_COOKIE_NAMES = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
];

// Private pages — matched in `config` below (statically).
/**
 * Optimistic auth gate: if no session cookie exists at all, the user cannot
 * be logged in, so bounce them to /sign-in and remember the page they wanted.
 *
 * This is a fast first gate only — cookie *presence* is not verified
 * cryptographically here. The real check happens in <PrivateRoute>
 * (via authClient.useSession), and eventually in the server APIs.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
        request.cookies.has(name)
    );

    if (!hasSessionCookie) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect", `${pathname}${search}`);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Must be a static array — Turbopack statically parses this, so it
    // cannot reference the PROTECTED_PATHS constant above.
    matcher: ["/creat-event", "/joined-events", "/manage-events"],
};
