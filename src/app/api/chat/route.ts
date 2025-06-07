import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import {
  SimpleDocumentStore,
  storageContextFromDefaults,
  VectorStoreIndex,
  VectorIndexRetriever,
  BaseRetriever,
} from "llamaindex";

import { Document, MetadataMode, NodeWithScore, Settings } from "llamaindex";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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
    }

    return [];
  }
}

const knowledge: Knowledge = new Knowledge();

// ----------------- //

export async function POST(req: Request) {
  // TODO: have a non-streaming option?
  const { messages, stream } = await req.json();

  console.log("Received messages:", messages);

  const lastMsg = messages.length - 1
  const userQuery = messages[lastMsg].content;
  const chunks = await knowledge.retrieve(userQuery);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: "API key not configured",
        content: "API key not configured",
      },
      { status: 500 }
    );
  }

  if (chunks) {
    messages[lastMsg].content = `User Query: ${messages[lastMsg].content}\nContext: \n${chunks.join("\n\n")}`;
  }

  console.log("NEW messages:", messages);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toTextStreamResponse();
}
