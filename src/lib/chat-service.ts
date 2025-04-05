import { openai } from "@ai-sdk/openai";
import { CoreAssistantMessage, CoreMessage, CoreSystemMessage } from "ai";

export class ChatService {
  systemPrompt: CoreSystemMessage;

  constructor(systemPrompt: string) {
    this.systemPrompt = { role: "system", content: systemPrompt || "" };
  }

  async chat(
    messages: CoreMessage[],
    stream: boolean = false
  ): Promise<ReadableStream<string> | CoreAssistantMessage> {
    try {
      if (stream) {
        console.log(messages);
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: [this.systemPrompt, ...messages],
            stream: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown error occurred");
        }

        const binaryStream = response.body;

        if (!binaryStream) {
          throw new Error("No binary stream received from the server.");
        }

        const textStream = binaryStream.pipeThrough(new TextDecoderStream());

        return textStream as ReadableStream<string>;
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: [this.systemPrompt, ...messages],
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown error occurred");
        }

        // For non-streaming, read the entire response
        const result = await response.text();
        return { role: "assistant", content: result };
      }
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }
}
