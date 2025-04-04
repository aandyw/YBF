"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send } from "lucide-react";

import { CoreAssistantMessage, CoreMessage, CoreUserMessage } from "ai";
import { ChatService } from "@/lib/chat-service";
import { ChatWidgetSDKConfig } from "@/lib/config";

const ChatWidget: React.FC<
  ChatWidgetSDKConfig & { chatService: ChatService }
> = ({
  title = "Chat",
  placeholderText = "Ask me anything...",
  height = "520px",
  width = "380px",
  position = "bottom-right",
  openByDefault = false,
  initialMessages = [],
  numHistoryMessages = 3,
  chatService,
}) => {
  const [messages, setMessages] = useState<CoreMessage[]>(
    initialMessages.map((msg) => ({ role: "assistant", content: msg }))
  );

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(openByDefault);

  const handleChatRequest = async () => {
    if (input.trim() === "") return; // Empty response

    // Add new message to message history
    const newMessage: CoreUserMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Get response
    const response: CoreAssistantMessage = await chatService.chat(messages);
    setMessages((prevMessages) => [...prevMessages, response]);

    // Clear the input box to type new message
    setInput("");
  };

  const getPositionStyles = () => {
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
  };

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
          className="flex flex-col overflow-hidden"
        >
          <CardHeader className="flex justify-between items-center px-4 py-2 shrink-0">
            <h2 className="text-lg font-medium text-gray-800">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4"></X>
            </Button>
          </CardHeader>

          <CardContent className="flex-grow overflow-y-auto m-2 py-4 px-4 border border-gray-200 rounded-sm">
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
                  {msg.content}
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex space-x-2">
            <Input
              type="text"
              placeholder={placeholderText}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Handle input + enter
                if (e.key === "Enter") {
                  handleChatRequest();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleChatRequest}>
              <Send className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
