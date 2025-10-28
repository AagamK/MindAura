'use client';

import {
  Activity,
  ArrowUpRight,
  Clock,
  Smile,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const moodData = [
  { name: 'Happy', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Calm', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Sad', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'Stressed', value: 100, fill: 'hsl(var(--chart-4))' },
];

const userGrowthData = [
  { date: '2023-05-01', users: 23 },
  { date: '2023-05-02', users: 31 },
  { date: '2023-05-03', users: 45 },
  { date: '2023-05-04', users: 52 },
  { date: '2023-05-05', users: 68 },
  { date: '2023-05-06', users: 73 },
  { date: '2023-05-07', users: 81 },
];

const recentActivity = [
    { username: 'Alex R.', mood: 'Calm', messages: 12, lastActive: '5m ago' },
    { username: 'Jessica M.', mood: 'Stressed', messages: 28, lastActive: '1h ago' },
    { username: 'David L.', mood: 'Happy', messages: 5, lastActive: '3h ago' },
    { username: 'Sarah B.', mood: 'Sad', messages: 15, lastActive: '1d ago' },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Users Today</CardDescription>
                  <CardTitle className="text-4xl">1,257</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last day
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Chat Sessions</CardDescription>
                  <CardTitle className="text-4xl">10,352</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Most Common Mood</CardDescription>
                  <CardTitle className="text-4xl">Calm</CardTitle>
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
                  <CardTitle className="text-4xl">8m 42s</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +5% from last week
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    <PieChart>
                      <Pie
                        data={moodData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {moodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New users over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
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
                    {recentActivity.map(activity => (
                    <TableRow key={activity.username}>
                      <TableCell>
                        <div className="font-medium">{activity.username}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{activity.mood}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{activity.messages}</TableCell>
                      <TableCell className="text-right">{activity.lastActive}</TableCell>
                    </TableRow>
                    ))}
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
