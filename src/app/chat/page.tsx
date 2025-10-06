'use client';

import ChatPanel from '@/components/chat/chat-panel';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [moodCheckComplete, setMoodCheckComplete] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const moodSelected = sessionStorage.getItem('moodSelected');
        if (!moodSelected) {
          router.push('/mood');
        } else {
          setMoodCheckComplete(true);
        }
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !moodCheckComplete) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-20 w-3/4" />
          <Skeleton className="ml-auto h-20 w-3/4" />
          <Skeleton className="h-20 w-2/4" />
          <Skeleton className="ml-auto h-20 w-3/4" />
        </div>
      </div>
    );
  }

  return <ChatPanel />;
}
