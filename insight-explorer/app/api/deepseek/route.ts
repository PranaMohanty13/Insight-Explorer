import { NextResponse } from "next/server";
import deepseekClient from "@/lib/deepseek-client";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call the DeepSeek API as per their documentation.
    const completion = await deepseekClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
      // You can add additional parameters here if needed (like temperature, max_tokens, etc.)
    });

    // Return the report content.
    return NextResponse.json({ report: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("DeepSeek API error:", error);
    return NextResponse.json(
      { error: "Error fetching report from DeepSeek API", details: error.message },
      { status: 500 }
    );
  }
}
