"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget, { ChatWidgetProps } from "../components/chat-widget";

export interface ChatWidgetSDKConfig extends ChatWidgetProps {
  /** ID of the container element where the chatbot will be rendered */
  elementId?: string;
}

class ChatWidgetSDK {
  private config: ChatWidgetSDKConfig;
  private root: any = null;
  private container: HTMLElement | null = null;

  constructor(config: ChatWidgetSDKConfig = {}) {
    // Default options
    this.config = {
      elementId: "ybf-container",
      chatEndpoint: "/api/chat",
      initialMessages: [],
      placeholderText: "Ask me anything...",
      numHistoryMessages: 3,
      title: "YBF",
      height: "500px",
      width: "350px",
      position: "bottom-right",
      openByDefault: false,
      systemPrompt: "You are a helpful AI assistant.",
      ...config,
    };
  }

  /**
   * Initialize the chatbot and render it to the DOM
   * @returns This ChatWidgetSDK instance for chaining
   */
  public init(): ChatWidgetSDK {
    if (typeof window === "undefined") {
      console.warn("ChatWidgetSDK.init() called in a non-browser environment");
      return this;
    }

    // Create container if it doesn't exist
    this.container = document.getElementById(
      this.config.elementId || "ybf-chatbot-container",
    );

    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = this.config.elementId || "ybf-chatbot-container";
      document.body.appendChild(this.container);
    }

    // Render the chat widget
    try {
      this.root = createRoot(this.container);
      this.root.render(<ChatWidget {...this.config} />);
      console.log("YBF Chatbot initialized successfully");
    } catch (error) {
      console.error("Failed to initialize YBF Chatbot:", error);
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
        console.error("Failed to destroy YBF Chatbot:", error);
      }
    }

    // Remove the container if we created it
    if (
      this.container &&
      this.container.parentNode &&
      this.config.elementId === "ybf-chatbot-container"
    ) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }

    return this;
  }
}

export default ChatWidgetSDK;
