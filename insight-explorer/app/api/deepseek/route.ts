import { NextResponse } from "next/server";
import deepseekClient from "@/lib/DeepSeekClient";
import { cleanReportText } from "@/lib/CleanReportText";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call DeepSeek API using your deepseekClient.
    const completion = await deepseekClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
    });

    // Extract the raw report and clean it.
    const rawReport = completion.choices[0].message.content;
    const cleanReport = cleanReportText(rawReport ?? "");

    return NextResponse.json({ report: cleanReport });
  } catch (error: any) {
    console.error("DeepSeek API error:", error);
    return NextResponse.json(
      { error: "Error fetching report from DeepSeek API", details: error.message },
      { status: 500 }
    );
  }
}
