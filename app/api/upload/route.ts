import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "sajawat-designs";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed." },
                { status: 400 }
            );
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            return NextResponse.json(
                { error: "Cloudinary is not configured. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local" },
                { status: 500 }
            );
        }

        // Build the upload path: sajawat-designs/{folder}
        const uploadFolder = `sajawat-designs/${folder}`;

        // Create signature for authenticated upload
        const timestamp = Math.round(Date.now() / 1000);
        const paramsToSign = `folder=${uploadFolder}&timestamp=${timestamp}${apiSecret}`;

        // Generate SHA-1 signature
        const encoder = new TextEncoder();
        const data = encoder.encode(paramsToSign);
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        // Upload to Cloudinary
        const cloudinaryForm = new FormData();
        cloudinaryForm.append("file", file);
        cloudinaryForm.append("folder", uploadFolder);
        cloudinaryForm.append("timestamp", String(timestamp));
        cloudinaryForm.append("api_key", apiKey);
        cloudinaryForm.append("signature", signature);

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: cloudinaryForm }
        );

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            return NextResponse.json(
                { error: errorData.error?.message || "Upload failed" },
                { status: 500 }
            );
        }

        const result = await uploadResponse.json();

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
