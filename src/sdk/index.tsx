"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "@/components/chat-widget";
import { ChatService } from "@/lib/chat-service";
import { CoreMessage } from "ai";
import { ChatWidgetSDKConfig } from "@/lib/config";

class ChatWidgetSDK {
  private chatService: ChatService;
  private config: ChatWidgetSDKConfig;
  private root: any = null;
  private container: HTMLElement | null = null;
  private static containerId = "ybf-container";

  constructor(config: ChatWidgetSDKConfig = {}) {
    // Create chat service
    const systemPrompt = config.systemPrompt || "";
    this.chatService = new ChatService(systemPrompt);

    // Default options
    this.config = {
      title: "Chat", // Display Properties
      placeholderText: "Ask me anything...",
      height: "520px",
      width: "380px",
      position: "bottom-right", // Behavioral Properties
      openByDefault: false,
      initialMessages: [], // Messaging Properties
      numHistoryMessages: 3,
      ...config,
    };
  }

  /**
   * Initialize the chatbot and render it to the DOM
   * @returns This ChatWidgetSDK instance for chaining
   */
  public init(): ChatWidgetSDK | null {
    if (typeof window === "undefined") {
      console.warn("ChatWidgetSDK.init() called in a non-browser environment");
      return null;
    }

    this.container = document.getElementById(ChatWidgetSDK.containerId);

    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = ChatWidgetSDK.containerId;
      document.body.appendChild(this.container);
    }

    // Render the chat widget
    try {
      this.root = createRoot(this.container);
      this.root.render(
        <ChatWidget {...this.config} chatService={this.chatService} />
      );
      console.log("YBF widget initialized successfully");
    } catch (error) {
      console.error("Failed to initialize YBF widget:", error);
    }

    return this;
  }

  /**
   * Clean up and remove the chatbot from the DOM
   * @returns This ChatWidgetSDK instance for chaining
   */
  public destroy(): ChatWidgetSDK {
    if (this.root) {
      try {
        this.root.unmount();
        this.root = null;
      } catch (error) {
        console.error("Failed to destroy YBF widget:", error);
      }
    }

    // Remove the container if we created it
    if (
      this.container &&
      this.container.parentNode &&
      this.container.id === "ybf-container"
    ) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }

    return this;
  }
}

export default ChatWidgetSDK;
