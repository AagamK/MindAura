'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState, useTransition } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { summarizeChat } from '@/ai/flows/summarize-chat-flow';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const CHAT_HISTORY_KEY = 'mindaura_chat_history';

export default function Dashboard() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages) as ChatMessage[];
        // Filter out the initial welcome message
        if (parsed.length > 1) {
          setChatHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history from local storage', error);
    }
  }, []);

  const handleGenerateSummary = () => {
    if (!chatHistory) return;

    startSummaryTransition(async () => {
      const result = await summarizeChat({ chatHistory });
      setSummary(result.summary);
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6 lg:p-8">
      <main className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Chat Summary</CardTitle>
            <CardDescription>
              A brief AI-generated summary of your last conversation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chatHistory ? (
              <div>
                {summary ? (
                  <p className="text-sm text-muted-foreground">{summary}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Get a summary of your last conversation.
                    </p>
                    <Button
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                    >
                      {isSummarizing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Summary'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  You haven't had a chat session yet.
                </p>
                <Button asChild>
                  <Link href="/chat">Start a Conversation</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
