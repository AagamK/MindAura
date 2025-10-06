'use client';

import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { User as FirebaseUser } from 'firebase/auth';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatMessageProps {
  message: ChatMessage;
  user: FirebaseUser | null;
}

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
  </div>
);

export default function ChatMessage({ message, user }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isLoading = message.content === '...';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar>
        <AvatarImage
          src={isUser ? user?.photoURL ?? '' : undefined}
          alt={isUser ? user?.displayName ?? 'User' : 'MindAura'}
        />
        <AvatarFallback>
          {isUser ? <User /> : <Bot />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-md rounded-xl px-4 py-3 shadow-md md:max-w-2xl',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-card-foreground'
        )}
      >
        {isLoading ? <LoadingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
      </div>
    </div>
  );
}
