'use client';

import { empatheticAIChatbot } from '@/ai/flows/empathetic-ai-chatbot';
import { useAuth } from '@/hooks/use-auth';
import type { ChatMessage as Message } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ChatMessage from './chat-message';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

const getInitialMessage = (): Message => {
  let mood: string | null = null;
  if (typeof window !== 'undefined') {
    mood = sessionStorage.getItem('userMood');
  }
  const content = mood
    ? `Hello, I'm MindAura. I see you're feeling a bit ${mood.toLowerCase()} today. I'm here to listen whenever you're ready to share.`
    : "Hello, I'm MindAura. I'm here to listen and offer a supportive space for your thoughts. How are you feeling today?";

  return { id: 'init', role: 'model', content };
};

export default function ChatPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([getInitialMessage()]);
    setShowClearConfirm(false);
    toast({
      title: 'Conversation Cleared',
      description: 'You can start fresh now.',
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: values.message,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    form.reset();

    startTransition(async () => {
      const loadingMessage: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        content: '...', // This will be rendered as a loading indicator
      };
      setMessages([...newMessages, loadingMessage]);

      try {
        const result = await empatheticAIChatbot({
          userMessage: values.message,
        });
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'model',
          content: result.chatbotResponse,
        };
        setMessages([...newMessages, aiMessage]);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description:
            'There was a problem with the AI. Please try again later.',
        });
        setMessages(newMessages); // remove loading and user message
      }
    });
  }

  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="border-b bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto flex max-w-3xl items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Your Conversation
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <div className="container mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} user={user} />
            ))}
          </div>
        </div>
        <div className="border-t bg-card/80 p-4 backdrop-blur-sm md:p-6">
          <div className="container mx-auto max-w-3xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-start space-x-4"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="resize-none rounded-2xl border-2 border-input bg-background/80 focus:border-primary"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={isPending} className="rounded-full h-10 w-10">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently clear your current conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
