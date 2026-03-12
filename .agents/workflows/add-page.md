---
description: add-page
---

# Add Page Workflow

Follow these steps to add a new page to the Portal-Pelayanan-Publik project.

1.  **Determine Route**: Decide the path for the new page in `src/app/`.
2.  **Create Directory**: Create the directory if it doesn't exist (e.g., `src/app/my-new-page/`).
3.  **Create page.tsx**:
    ```tsx
    import { Metadata } from "next";

    export const metadata: Metadata = {
        title: "My New Page | Portal Pelayanan Publik",
        description: "Description of the page content.",
    };

    export default function MyNewPage() {
        return (
            <main className="container mx-auto py-10">
                <h1 className="text-3xl font-bold">My New Page</h1>
                {/* Content goes here */}
            </main>
        );
    }
    ```
4.  **Server vs Client**: Keep the main page a Server Component if possible. Extract interactive parts into "use client" components.
5.  **Layout Integration**: Ensure it inherits from the appropriate layout (dashboard, public, etc.).
6.  **SEO**: Always add proper `metadata` as shown above.
