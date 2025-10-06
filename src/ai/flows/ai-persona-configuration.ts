'use server';

/**
 * @fileOverview Configures an AI persona for empathetic and mindful conversations.
 *
 * - configureAIPersona - A function that configures the AI persona.
 * - ConfigureAIPersonaInput - The input type for the configureAIPersona function.
 * - ConfigureAIPersonaOutput - The return type for the configureAIPersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPersonaConfigurationInputSchema = z.object({
  userMessage: z.string().describe('The message from the user to the AI.'),
});
export type AIPersonaConfigurationInput = z.infer<typeof AIPersonaConfigurationInputSchema>;

const AIPersonaConfigurationOutputSchema = z.object({
  aiResponse: z.string().describe('The AI’s empathetic and mindful response.'),
});
export type AIPersonaConfigurationOutput = z.infer<typeof AIPersonaConfigurationOutputSchema>;

export async function aiPersonaConfiguration(input: AIPersonaConfigurationInput): Promise<AIPersonaConfigurationOutput> {
  return aiPersonaConfigurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPersonaConfigurationPrompt',
  input: {schema: AIPersonaConfigurationInputSchema},
  output: {schema: AIPersonaConfigurationOutputSchema},
  prompt: `You are MindAura, a compassionate AI providing emotional support and mindfulness. Respond to the user message with empathy, warmth, and mindfulness.\n\nUser Message: {{{userMessage}}}\n\nAvoid giving medical or diagnostic advice.`,
});

const aiPersonaConfigurationFlow = ai.defineFlow(
  {
    name: 'aiPersonaConfigurationFlow',
    inputSchema: AIPersonaConfigurationInputSchema,
    outputSchema: AIPersonaConfigurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
