import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const session = request.cookies.get("auth_session");
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");

    if (isDashboard && !session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isLoginPage && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
