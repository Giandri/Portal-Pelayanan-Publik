import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const session = request.cookies.get("auth_session");
    const isAuthenticated = session?.value === "authenticated";

    // Protected routes
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isAdminMenu = request.nextUrl.pathname.startsWith("/admin-menu");
    const isScan = request.nextUrl.pathname.startsWith("/scan");

    // Login routes
    const isPortalAdmin = request.nextUrl.pathname.startsWith("/portal-admin");
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");

    if ((isDashboard || isAdminMenu || isScan) && !isAuthenticated) {
        return NextResponse.redirect(new URL("/portal-admin", request.url));
    }

    if ((isPortalAdmin || isLoginPage) && isAuthenticated) {
        return NextResponse.redirect(new URL("/admin-menu", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin-menu/:path*", "/scan/:path*", "/login", "/portal-admin"],
};
