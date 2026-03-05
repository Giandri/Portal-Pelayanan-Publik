import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "admin" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Admin output documents
    permitAttachment: f({ pdf: { maxFileSize: "4MB", maxFileCount: 4 }, image: { maxFileSize: "4MB", maxFileCount: 4 } })
        .middleware(async ({ req }) => {
            const user = await auth(req);
            if (!user) throw new Error("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId };
        }),

    // KTP photo upload (public, no auth needed)
    ktpUpload: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("KTP uploaded:", file.url);
            return { url: file.url, name: file.name, size: file.size, type: file.type, key: file.key };
        }),

    // Surat lampiran upload (public, no auth needed)
    lampiranUpload: f({
        pdf: { maxFileSize: "8MB", maxFileCount: 5 },
        image: { maxFileSize: "8MB", maxFileCount: 5 },
        "application/msword": { maxFileSize: "8MB", maxFileCount: 5 },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 5 },
    })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Lampiran uploaded:", file.url);
            return { url: file.url, name: file.name, size: file.size, type: file.type, key: file.key };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
