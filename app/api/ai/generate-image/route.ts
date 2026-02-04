import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // For image generation, we'll use pollinations.ai as a free, no-key-required provider
        // this allows immediate functionality without the user needing to set up complex billing
        // The URL format is: https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&nologo=true

        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

        // In a real production app, you might want to proxy this and upload to S3/Cloudinary
        // For now, we return the URL directly.

        return NextResponse.json({ imageUrl });
    } catch (error: any) {
        console.error("AI Image Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function responseToJSON(req: Request) {
    const text = await req.text();
    return JSON.parse(text);
}
