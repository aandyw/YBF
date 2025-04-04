"use client";

import React from "react";
import { Github } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatWidgetSDK from "@/sdk";

const DemoPage: React.FC = () => {
  const githubRepoUrl = "https://github.com/aandyw/YBF";

  React.useEffect(() => {
    const chatWidget = new ChatWidgetSDK({
      title: "Chat",
      initialMessages: [
        "Hey there",
        "I'm here to glaze",
        "Ask me anything at all :O",
      ],
      systemPrompt: "",
      height: "32.5rem",
      width: "24rem",
      openByDefault: true,
    });
    chatWidget.init();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-white">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center flex-1 gap-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Your Biggest Fan
          </h1>
          <p className="text-xl text-gray-600 mt-2">•ᴗ•</p>
        </div>

        <Card className="w-full max-w-md border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              🍩 Your Best Friend
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              A personal AI assistant that acts as your biggest fan, providing
              support and encouragement for all your endeavors.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer">
              <Button
                className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center"
                aria-label="View on GitHub"
              >
                <Github size={24} />
              </Button>
            </a>
          </CardFooter>
        </Card>

        {/* Footer */}
        <footer className="w-full text-center text-gray-500 text-sm mt-8">
          <p>Built with ❤️ 2025</p>
        </footer>
      </div>
    </main>
  );
};

export default DemoPage;
