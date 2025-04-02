export interface ChatWidgetSDKConfig {
  /** Title displayed in the chatbot header */
  title?: string;
  /** Placeholder text for the input field */
  placeholderText?: string;
  /** Height of the chat widget window */
  height?: string;
  /** Width of the chat widget window */
  width?: string;
  /** Positioning for the chat widget */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Whether the widget starts opened */
  openByDefault?: boolean;
  /** Initial messages to populate the chat */
  initialMessages?: string[];
  /** Chatbot system prompt */
  systemPrompt?: string;
  /** Number of history messages to use */
  numHistoryMessages?: number;
}
