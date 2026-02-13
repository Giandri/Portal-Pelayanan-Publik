
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const filename = searchParams.get("filename");

    if (!fileUrl || !filename) {
        return NextResponse.json(
            { error: "URL and filename are required" },
            { status: 400 }
        );
    }

    try {
        // Validation: ensure URL is from utfs.io or our own domain keys
        if (!fileUrl.includes("utfs.io")) {
            return NextResponse.json(
                { error: "Invalid file provider" },
                { status: 400 }
            );
        }

        const response = await fetch(fileUrl);

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch file" },
                { status: response.status }
            );
        }

        const encodedFilename = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\*/g, '%2A');

        const headers = new Headers(response.headers);
        headers.set("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);

        return new NextResponse(response.body, {
            status: 200,
            headers: headers,
        });

    } catch (error) {
        console.error("Download proxy error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
