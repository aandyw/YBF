import {
  CoreAssistantMessage,
  CoreMessage,
  CoreSystemMessage,
  CoreUserMessage,
} from "ai";
import { internalSystemPrompt } from "./prompts";

import {
  QueryEngineTool,
  Settings,
  VectorStoreIndex,
  RetrieverQueryEngine,
  BaseRetriever,
  VectorIndexRetriever,
} from "llamaindex";
import { OpenAI, OpenAIAgent } from "@llamaindex/openai";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";

export class ChatService {
  private systemPrompt: CoreSystemMessage;
  private dataDir: string;
  private retriever: BaseRetriever | null = null;

  constructor(subjectName: string, userSystemPrompt: string, dataDir: string) {
    const additionalContext = `\n\n###Additional Context:\n\n**Subject's Name:** ${subjectName}\n\n${userSystemPrompt}`;
    const systemPrompt = internalSystemPrompt + additionalContext;

    this.systemPrompt = { role: "system", content: systemPrompt };
    this.dataDir = dataDir;

    // Setup llamaindex for RAG
    // this.initKnowledge();
  }

  // async initKnowledge() {
  //   // Settings.embedModel = new HuggingFaceEmbedding({
  //   //   modelType: "BAAI/bge-small-en-v1.5",
  //   // });
  //   // const reader = new SimpleDirectoryReader();
  //   // const documents = await reader.loadData(this.dataDir);
  //   // const index = await VectorStoreIndex.fromDocuments(documents);
  //   // this.retriever = await index.asRetriever({ similarityTopK: 3 });
  // }

  async chat(
    messages: CoreMessage[],
    stream: boolean = false
  ): Promise<ReadableStream<string> | CoreAssistantMessage> {
    try {
      const userQuery = messages[messages.length - 1].content as string;

      let retrievedChunks = null;
      if (this.retriever) {
        retrievedChunks = await this.retriever.retrieve({
          query: userQuery,
        });
      }

      console.log(retrievedChunks);

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
