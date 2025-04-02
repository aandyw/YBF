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
  ): Promise<CoreAssistantMessage> {
    try {
      if (stream) {
        return { role: "assistant", content: "" };
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: [this.systemPrompt, ...messages],
          }),
        });

        const { content } = await response.json();

        return { role: "assistant", content: content };
      }
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }
}
