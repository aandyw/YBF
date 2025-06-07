import { OpenAIEmbedding } from "@llamaindex/openai";
import { Settings } from "llamaindex";

export function initSettings() {
  Settings.embedModel = new OpenAIEmbedding({
    model: "text-embedding-3-small",
  });
}
