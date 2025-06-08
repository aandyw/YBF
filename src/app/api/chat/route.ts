import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText, tool } from "ai";

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
      (storageContext.docStore as SimpleDocumentStore).toDict()
    ).length;

    if (numberOfDocs === 0) {
      throw new Error(
        "Index not found. Please run `pnpm run generate` to generate the embeddings of the documents"
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
      const chunks: Array<string> = sourceNodes.map(
        (source: NodeWithScore, index: number) => {
          return source.node.getContent(MetadataMode.NONE);
        }
      );
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
  const { messages, stream } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: "API key not configured",
        content: "API key not configured",
      },
      { status: 500 }
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    maxRetries: 2,
    maxSteps: 2,
    tools: {
      getKnowledge: tool({
        description:
          "Retrieve comprehensive knowledge about the subject. This tool is specifically designed to fetch details regarding the subject's professional skills, past work experience, notable accomplishments, and any other relevant background information. Use this tool whenever a user asks about the subject's qualifications, history, or abilities.",
        parameters: z.object({
          userQuery: z
            .string()
            .describe(
              "The specific question or topic the user is asking about the subject. This should be a direct query suitable for knowledge retrieval."
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
            return "No specific knowledge found on this topic.";
          }
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
