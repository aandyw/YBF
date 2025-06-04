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
import { MessageSquare, X, Send, Sun, Moon } from "lucide-react";

import { CoreAssistantMessage, CoreMessage, CoreUserMessage } from "ai";
import { ChatService } from "@/app/chat-service";
import { ChatWidgetSDKConfig } from "@/app/config";

import ReactMarkdown from "react-markdown";

const ChatWidget: React.FC<
  ChatWidgetSDKConfig & { chatService: ChatService }
> = ({
  height = "520px",
  width = "380px",
  position = "bottom-right",
  openByDefault = false,
  initialMessages = [],
  numHistoryMessages = 3, // TODO: use this to reduce context limits and save money
  chatService,
}) => {
  const [messages, setMessages] = useState<CoreMessage[]>(
    initialMessages.map((msg) => ({ role: "assistant", content: msg }))
  );

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(openByDefault);
  const [isDark, setIsDark] = useState(true);

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
          }}
          className="flex flex-col px-0 py-0 mx-0 my-0 gap-2"
        >
          <CardHeader className="flex justify-end items-center px-4 py-0 pt-3 my-0 mx-0 shrink-0 gap-0">
            {isDark ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(false)}
                className="h-8 w-8 p-0 mr-2"
              >
                <Sun className="h-4 w-4"></Sun>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(true)}
                className="h-8 w-8 p-0 mr-2"
              >
                <Moon className="h-4 w-4"></Moon>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4"></X>
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
                      ? "bg-amber-50 text-gray-800 border border-amber-200 rounded-br-none"
                      : "bg-gray-100 text-gray-800 border border-gray-300 rounded-bl-none"
                  } px-4 py-3 rounded-lg`}
                  style={{
                    fontSize: msg.role === "user" ? "0.95rem" : "1rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
              className="min-h-[3rem] max-h-[15rem] resize-none rounded-xl transition-all duration-200 focus:ring-0 focus:ring-offset-0 shadow-sm px-5 py-4"
            >
              <Button onClick={handleChatRequest}>
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
