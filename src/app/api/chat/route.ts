import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";

import {
  SimpleDocumentStore,
  storageContextFromDefaults,
  VectorStoreIndex,
  VectorIndexRetriever,
  BaseRetriever,
  MetadataMode,
  NodeWithScore,
} from "llamaindex";

import { z } from "zod";
import { knowledgeToolPrompt } from "@/app/prompts";

// ----- Retriever ----- //
class Knowledge {
  private static retriever: BaseRetriever;

  public async init(): Promise<void> {
    Knowledge.retriever = await this.getRetriever();
  }

  async getIndex(): Promise<VectorStoreIndex> {
    const storageContext = await storageContextFromDefaults({
      persistDir: "storage",
    });

    const numberOfDocs = Object.keys(
      (storageContext.docStore as SimpleDocumentStore).toDict(),
    ).length;

    if (numberOfDocs === 0) {
      throw new Error(
        "Index not found. Please run `pnpm run generate` to generate the embeddings of the documents",
      );
    }

    return await VectorStoreIndex.init({ storageContext });
  }

  async getRetriever(): Promise<VectorIndexRetriever> {
    console.log("Initializing retriever...");
    const vectorIndex = await this.getIndex();
    const retriever = vectorIndex.asRetriever({ similarityTopK: 3 });
    return retriever;
  }

  /** Main retrieval function to be used to retrieve knowledge */
  async retrieve(query: string): Promise<Array<string>> {
    if (!Knowledge.retriever) {
      await this.init();
    }

    const sourceNodes = await Knowledge.retriever.retrieve({ query });

    if (sourceNodes) {
      const chunks: Array<string> = sourceNodes.map((source: NodeWithScore) => {
        return source.node.getContent(MetadataMode.NONE);
      });
      return chunks;
    } else {
      console.log("No source nodes found for query: ", query);
    }

    return [];
  }
}

const knowledge: Knowledge = new Knowledge();

// ----------------- //

export async function POST(req: Request) {
  // TODO: have a non-streaming option?
  const { messages } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: "API key not configured",
        content: "API key not configured",
      },
      { status: 500 },
    );
  }

  // Define knowledge tool
  const getKnowledge = tool({
    description: knowledgeToolPrompt,
    parameters: z.object({
      userQuery: z
        .string()
        .describe(
          "The specific question or topic the user is asking about the subject. This should be a direct query suitable for knowledge retrieval.",
        ),
    }),
    execute: async ({ userQuery }) => {
      console.log("Executing getKnowledge tool with query:", userQuery);
      const chunks = await knowledge.retrieve(userQuery);

      if (chunks && chunks.length > 0) {
        console.log("Chunks retrieved:", chunks.join("\n\n"));
        return chunks.join("\n\n");
      } else {
        console.log("No relevant knowledge found for query:", userQuery);
        return "No specific knowledge found.";
      }
    },
  });

  const result = streamText({
    model: google("gemini-2.5-flash-preview-05-20"),
    messages,
    maxRetries: 2,
    maxSteps: 2, // Allow function call + response with tool result
    tools: { getKnowledge },
  });

  return result.toTextStreamResponse();
}
