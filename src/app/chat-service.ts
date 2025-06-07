import { CoreAssistantMessage, CoreMessage, CoreSystemMessage } from "ai";
import { internalSystemPrompt } from "./prompts";

/** Chat service to handle the streaming chat */
export class ChatService {
  private systemPrompt: CoreSystemMessage;

  constructor(subjectName: string, userSystemPrompt: string) {
    const additionalContext = `\n\n###Additional Context:\n\n**Subject's Name:** ${subjectName}\n\n${userSystemPrompt}`;
    const systemPrompt = internalSystemPrompt + additionalContext;
    this.systemPrompt = { role: "system", content: systemPrompt };
  }

  async chat(
    messages: CoreMessage[],
    stream: boolean = false
  ): Promise<ReadableStream<string> | CoreAssistantMessage> {
    try {
      const userQuery = messages[messages.length - 1].content as string;

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
