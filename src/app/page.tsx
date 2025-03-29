"use client";

import React, { useEffect } from "react";
import ChatbotSDK from "../sdk";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const DemoPage: React.FC = () => {
  useEffect(() => {
    // Initialize the chatbot
    const chatbot = new ChatbotSDK({
      chatEndpoint: "/api/chat",
      title: "Your Biggest Fan",
      initialMessages: [{ role: "assistant", content: "Hey!" }],
      systemPrompt: "You are my biggest fan.",
    });

    // Render the chatbot
    chatbot.init();

    // Clean up on component unmount
    return () => {
      chatbot.destroy();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <body>
        <div style={{ maxWidth: "800px", margin: "0 2rem", padding: "2rem" }}>
          <h1>Your Biggest Fan</h1>
          <p>•ᴗ•</p>
        </div>
      </body>
    </main>
  );
};

export default DemoPage;
