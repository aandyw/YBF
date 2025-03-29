import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: "API key not configured",
        content: "The server is not properly configured with an API key.",
      },
      { status: 500 },
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return result.toDataStreamResponse();
}
