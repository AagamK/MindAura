'use server';
/**
 * @fileOverview An empathetic AI chatbot for providing supportive and mindful conversation.
 *
 * - empatheticAIChatbot - A function that interacts with the AI chatbot.
 * - EmpatheticAIChatbotInput - The input type for the empatheticAIChatbot function.
 * - EmpatheticAIChatbotOutput - The return type for the empatheticAIChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticAIChatbotInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
});
export type EmpatheticAIChatbotInput = z.infer<typeof EmpatheticAIChatbotInputSchema>;

const EmpatheticAIChatbotOutputSchema = z.object({
  chatbotResponse: z.string().describe('The AI chatbot response.'),
});
export type EmpatheticAIChatbotOutput = z.infer<typeof EmpatheticAIChatbotOutputSchema>;

export async function empatheticAIChatbot(input: EmpatheticAIChatbotInput): Promise<EmpatheticAIChatbotOutput> {
  return empatheticAIChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticAIChatbotPrompt',
  input: {schema: EmpatheticAIChatbotInputSchema},
  output: {schema: EmpatheticAIChatbotOutputSchema},
  prompt: `You are MindAura, an empathetic and gentle AI designed to provide supportive and mindful conversation. Offer comforting and understanding responses, but do not give medical or diagnostic advice.\n\nUser message: {{{userMessage}}}`,
});

const empatheticAIChatbotFlow = ai.defineFlow(
  {
    name: 'empatheticAIChatbotFlow',
    inputSchema: EmpatheticAIChatbotInputSchema,
    outputSchema: EmpatheticAIChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
