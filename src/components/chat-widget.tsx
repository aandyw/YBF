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

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatWidgetProps {
  /** The chat API endpoint */
  chatEndpoint?: string;
  /** Initial messages to populate the chat */
  initialMessages?: Array<{ role: "user" | "assistant"; content: string }>;
  /** Chatbot system prompt */
  systemPrompt?: string;
  /** Number of history messages to use */
  numHistoryMessages?: number;
  /** Placeholder text for the input field */
  placeholderText?: string;
  /** Title displayed in the chatbot header */
  title?: string;
  /** Height of the chat widget window */
  height?: string;
  /** Width of the chat widget window */
  width?: string;
  /** Positioning for the chat widget */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Whether the widget starts opened */
  openByDefault?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  chatEndpoint = "/api/chat",
  initialMessages = [],
  systemPrompt = "You are a helpful AI assistant.",
  numHistoryMessages = 5,
  placeholderText = "Type your message...",
  title = "Chat with us",
  height = "520px",
  width = "380px",
  position = "bottom-right",
  openByDefault = false,
}) => {
  const [history, setHistory] = useState<Message[]>(initialMessages);

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(openByDefault);

  const handleRequest = () => {
    if (input.trim() === "") return; // Empty response

    const newMessage: Message = { role: "user", content: input };
    setHistory((prevHistory) => [...prevHistory, newMessage]);

    // Simulate a bot reply after one second.
    setTimeout(() => {
      const botResponse: Message = { role: "assistant", content: "Hey :)" };
      setHistory((prevHistory) => [...prevHistory, botResponse]);
    }, 1000);

    // Clear the input box to type new message
    setInput("");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-lg font-bold">Chat with Your Biggest Fan</h2>
      </CardHeader>
      <CardContent className="h-64 overflow-y-auto">
        {history.map((msg, idx) => (
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
          placeholder="Chat..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleRequest}>Send</Button>
      </CardFooter>
    </Card>
  );
};

export default ChatWidget;
