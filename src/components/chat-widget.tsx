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
  return <></>;
};

export default ChatWidget;
