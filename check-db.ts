
import { db } from "@/lib/db";

async function main() {
    try {
        console.log("Connecting to DB using project config...");
        const permit = await db.permit.findFirst({
            include: { survey: true }
        });

        if (permit) {
            console.log("DB Success. Found permit:", permit.trackingId);

            const trackingId = permit.trackingId;
            console.log("Testing API for Tracking ID:", trackingId);
            try {
                const response = await fetch(`http://localhost:3000/api/permits/track/${trackingId}`);
                console.log("API Status:", response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log("API Data Survey:", data.survey);
                    console.log("API Data Keys:", Object.keys(data));
                } else {
                    const text = await response.text();
                    console.error("API Error Text:", text);
                }
            } catch (apiErr) {
                console.error("API Fetch Failed:", apiErr);
            }
        } else {
            console.log("No permits found in DB to test.");
        }
    } catch (e) {
        console.error("DB Connection FAILED:", e);
    }
}

main();
