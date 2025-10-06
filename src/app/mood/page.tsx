'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😩', label: 'Stressed' },
];

export default function MoodPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleContinue = () => {
    if (selectedMood) {
      sessionStorage.setItem('moodSelected', 'true');
      sessionStorage.setItem('userMood', selectedMood);
      router.push('/chat');
    }
  };

  if (loading || !user) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-11 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            How are you feeling today?
          </CardTitle>
          <CardDescription className="pt-2">
            Your selection helps us to understand you better.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {moods.map((mood) => (
              <div
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-6 text-center transition-all duration-200',
                  selectedMood === mood.label
                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <span className="text-5xl transition-transform duration-200 group-hover:scale-110">
                  {mood.emoji}
                </span>
                <p className="mt-3 font-medium text-foreground">
                  {mood.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedMood}
          >
            Continue to Chat <ArrowRight className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
