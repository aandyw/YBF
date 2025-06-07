"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X, Send } from "lucide-react";

import { CoreMessage, CoreUserMessage } from "ai";
import { ChatService } from "@/app/chat-service";

import ReactMarkdown from "react-markdown";

export interface ChatWidgetSDKConfig {
  /** Name of the subject the chatbot hypes up */
  subjectName: string;
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

const ChatWidget: React.FC<
  ChatWidgetSDKConfig & { chatService: ChatService }
> = (args) => {
  const {
    height,
    width,
    position,
    openByDefault,
    initialMessages,
    numHistoryMessages,
    chatService,
  } = args;

  const [messages, setMessages] = useState<CoreMessage[]>(
    initialMessages?.map((msg) => ({ role: "assistant", content: msg })) || []
  );

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(openByDefault);

  // Checks if the last message was not sent by the user.
  function prevMessageNotUser(prevMessages: CoreMessage[]): boolean {
    return (
      prevMessages.length > 0 &&
      prevMessages[prevMessages.length - 1].role !== "user"
    );
  }

  // Handle a chat request sent by user
  async function handleChatRequest(): Promise<void> {
    if (input.trim() === "") return; // Empty response

    // Add new message to message history
    const newMessage: CoreUserMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear the input box to type new message
    setInput("");

    // Get streaming response
    const stream = (await chatService.chat(
      [...messages, newMessage],
      true
    )) as ReadableStream<string>;
    const reader = stream.getReader();

    let streamedContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamedContent += value; // Append streaming chunks
        setMessages((prevMessages) => [
          ...(prevMessageNotUser(prevMessages)
            ? prevMessages.slice(0, -1)
            : prevMessages),
          { role: "assistant", content: streamedContent },
        ]);
      }
    } catch (error) {
      console.error("Error reading stream:", error);
    }
  }

  function getPositionStyles(): React.CSSProperties {
    switch (position) {
      case "bottom-right":
        return { bottom: "1.25rem", right: "1.25rem" };
      case "bottom-left":
        return { bottom: "1.25rem", left: "1.25rem" };
      case "top-right":
        return { top: "1.25rem", right: "1.25rem" };
      case "top-left":
        return { top: "1.25rem", left: "1.25rem" };
      default:
        return { bottom: "1.25rem", right: "1.25rem" };
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        ...getPositionStyles(),
        zIndex: 1000,
      }}
    >
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card
          style={{
            width: width,
            height: height,
            fontFamily: "'Noto Serif JP', serif",
            transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
          }}
          className={`flex flex-col px-0 py-0 mx-0 my-0 gap-2 border bg-white border-gray-200 shadow-md hover:shadow-sm transition-shadow`}
        >
          <CardHeader className="flex justify-end items-center px-4 py-0 pt-3 my-0 mx-0 shrink-0 gap-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0 text-gray-700 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto px-5 py-0 mx-0 my-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] break-words ${
                    msg.role === "user"
                      ? "bg-gray-100 text-gray-900 border border-gray-200 rounded-br-none shadow-sm hover:bg-gray-200 transition-colors"
                      : "bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-none shadow-sm hover:bg-gray-100 transition-colors"
                  }
                  px-4 py-3 rounded-lg`}
                  style={{
                    fontSize: msg.role === "user" ? "0.95rem" : "1rem",
                  }}
                >
                  <ReactMarkdown>
                    {typeof msg.content === "string" ? msg.content : ""}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="px-5 py-0 pt-2 mb-4 mx-0">
            <Textarea
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent adding a new line
                  handleChatRequest(); // Trigger the send message function
                }
              }}
              className="min-h-[3rem] max-h-[15rem] resize-none rounded-xl transition-all duration-200 focus:ring-0 focus:ring-offset-0 shadow-sm px-5 py-4 bg-gray-50 text-gray-900 border-gray-200 placeholder:text-gray-400 focus:border-gray-100"
            >
              <Button
                onClick={handleChatRequest}
                className="bg-gray-100 hover:bg-gray-100 text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </Textarea>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
