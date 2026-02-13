"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In a real app, use a proper session library like next-auth or lucia
// This is a simple cookie-based auth for a single password as requested
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_COOKIE = "auth_session";

export async function setSession(formData: FormData) {
    const password = formData.get("password") as string;

    if (password === ADMIN_PASSWORD) {
        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        return { success: true };
    }

    return { error: "Password salah" };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    redirect("/portal-admin");
}

export async function getSession() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value === "authenticated";
}
