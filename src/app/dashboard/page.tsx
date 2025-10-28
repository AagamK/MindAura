'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useEffect, useState, useTransition } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { summarizeChat } from '@/ai/flows/summarize-chat-flow';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const moodData: any[] = [];
const userGrowthData: any[] = [];
const recentActivity: any[] = [];

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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Users Today</CardDescription>
                  <CardTitle className="text-4xl">--</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    --% from last day
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Chat Sessions</CardDescription>
                  <CardTitle className="text-4xl">--</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    --% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Most Common Mood</CardDescription>
                  <CardTitle className="text-4xl">---</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Across all sessions
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg. Session Duration</CardDescription>
                  <CardTitle className="text-4xl">--m --s</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    --% from last week
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-1">
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
                      <p className="text-sm text-muted-foreground">
                        {summary}
                      </p>
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                  <CardDescription>
                    A look at how users are feeling.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    {moodData.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={moodData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        />
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No mood data available.
                      </div>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    New users over the last 7 days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    {userGrowthData.length > 0 ? (
                      <LineChart data={userGrowthData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(val) =>
                            new Date(val).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No user growth data available.
                      </div>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Recent Chat Activity</CardTitle>
                <CardDescription>
                  An overview of the latest user conversations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Mood
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Messages
                      </TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <TableRow key={activity.username}>
                          <TableCell>
                            <div className="font-medium">
                              {activity.username}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline">{activity.mood}</Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {activity.messages}
                          </TableCell>
                          <TableCell className="text-right">
                            {activity.lastActive}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-10 text-center text-muted-foreground"
                        >
                          No recent activity.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
