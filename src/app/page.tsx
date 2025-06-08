"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    const chatWidget = new ChatWidgetSDK({
      subjectName: "George",
      initialMessages: [],
      systemPrompt: "",
      height: "40rem",
      width: "29.5rem",
      openByDefault: false,
    });
    chatWidget.init();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-white transition-colors">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center flex-1 gap-8">
        <Card className="w-full max-w-md border border-gray-200 shadow-sm transition-colors">
          <CardHeader className="pt-6">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 transition-colors">
                Your Biggest Fan
              </h1>
              <p className="text-xl text-gray-600 mt-2 transition-colors">
                •ᴗ•
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 transition-colors">
              🍩 Your personal over-the-top stan to convince ANYONE that you
              deserve more than you do.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer">
              <Button
                className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg p-3 h-12 w-12 flex items-center justify-center transition-colors"
                aria-label="View on GitHub"
              >
                <Github size={24} />
              </Button>
            </a>
          </CardFooter>
        </Card>

        {/* Footer */}
        <footer className="w-full text-center text-gray-500 text-sm mt-4 transition-colors">
          <p>Built with ❤️ in the year of economic collapse</p>
        </footer>
      </div>
    </main>
  );
};

export default DemoPage;
