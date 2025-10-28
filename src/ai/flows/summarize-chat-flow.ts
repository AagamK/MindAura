'use server';
/**
 * @fileOverview A flow to summarize a chat conversation.
 *
 * - summarizeChat - A function that takes a chat history and returns a summary.
 * - SummarizeChatInput - The input type for the summarizeChat function.
 * - SummarizeChatOutput - The return type for the summarizeChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const SummarizeChatInputSchema = z.object({
  chatHistory: z
    .array(ChatMessageSchema)
    .describe('The sequence of messages in the chat conversation.'),
});
export type SummarizeChatInput = z.infer<typeof SummarizeChatInputSchema>;

const SummarizeChatOutputSchema = z.object({
  summary: z
    .string()
    .describe('A short, neutral summary of the conversation.'),
});
export type SummarizeChatOutput = z.infer<typeof SummarizeChatOutputSchema>;

export async function summarizeChat(
  input: SummarizeChatInput
): Promise<SummarizeChatOutput> {
  return summarizeChatFlow(input);
}

const formatHistory = (history: z.infer<typeof ChatMessageSchema>[]) => {
  return history
    .map((msg) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
    .join('\n');
};

const prompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: { schema: SummarizeChatInputSchema },
  output: { schema: SummarizeChatOutputSchema },
  prompt: `Please provide a brief, neutral summary of the following chat conversation. Focus on the main topics discussed without adding any interpretation or opinion.\n\nConversation History:\n{{{formatHistory chatHistory}}}`,
  template: {
    helpers: {
      formatHistory,
    },
  },
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatInputSchema,
    outputSchema: SummarizeChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
