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
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="shadow-sm h-8 w-8">
          <AvatarFallback>
            <Bot className="text-accent" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-md rounded-xl px-4 py-3 shadow-md md:max-w-2xl',
          isUser
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none bg-card text-card-foreground'
        )}
      >
        {isLoading ? <LoadingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
      </div>
       {isUser && (
        <Avatar className="shadow-sm h-8 w-8">
            <AvatarImage
              src={user?.photoURL ?? ''}
              alt={user?.displayName ?? 'User'}
            />
            <AvatarFallback>
                <User className="text-primary" />
            </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}