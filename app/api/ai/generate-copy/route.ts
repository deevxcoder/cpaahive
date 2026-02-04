import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { prompt, category } = await req.json();

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set in environment variables." },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = category === 'landing'
            ? "You are an expert CPA marketing copywriter. Generate high-converting landing page headlines, subheadlines, and descriptions based on the following topic. Focus on scarcity, urgency, and high value. Keep it punchy and premium."
            : "You are an expert CPA marketing copywriter. Generate high-converting locker page instructions and call-to-actions. Focus on explaining how to complete an offer to unlock the content. Be clear and persuasive.";

        const fullPrompt = `${systemPrompt}\n\nTopic: ${prompt}\n\nReturn the copy in a clean, professional format.`;

        const result = await model.generateContent(fullPrompt);
        if (!result.response) {
            throw new Error("No response from Gemini API");
        }
        const text = result.response.text();

        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function responseToJSON(req: Request) {
    const text = await req.text();
    return JSON.parse(text);
}
