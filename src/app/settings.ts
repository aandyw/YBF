import { OpenAIEmbedding } from "@llamaindex/openai";
import { Settings } from "llamaindex";

export function initSettings() {
  Settings.embedModel = new OpenAIEmbedding({
    model: "text-embedding-3-small",
  });
  Settings.chunkSize = 256;
  Settings.chunkOverlap = 20;
}
