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
  placeholderText = "Type your message...",
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
        return { bottom: "20px", right: "20px" };
      case "bottom-left":
        return { bottom: "20px", left: "20px" };
      case "top-right":
        return { top: "20px", right: "20px" };
      case "top-left":
        return { top: "20px", left: "20px" };
      default:
        return { bottom: "20px", right: "20px" };
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
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <h2 className="text-lg font-bold">{title}</h2>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex space-x-2">
            <Input
              type="text"
              placeholder={placeholderText}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleChatRequest}>Send</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
