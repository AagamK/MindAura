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

const ConfigureAIPersonaInputSchema = z.object({
  userMessage: z.string().describe('The message from the user to the AI.'),
});
export type ConfigureAIPersonaInput = z.infer<typeof ConfigureAIPersonaInputSchema>;

const ConfigureAIPersonaOutputSchema = z.object({
  aiResponse: z.string().describe('The AI’s empathetic and mindful response.'),
});
export type ConfigureAIPersonaOutput = z.infer<typeof ConfigureAIPersonaOutputSchema>;

export async function configureAIPersona(input: ConfigureAIPersonaInput): Promise<ConfigureAIPersonaOutput> {
  return configureAIPersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'configureAIPersonaPrompt',
  input: {schema: ConfigureAIPersonaInputSchema},
  output: {schema: ConfigureAIPersonaOutputSchema},
  prompt: `You are MindAura, a compassionate AI providing emotional support and mindfulness. Respond to the user message with empathy, warmth, and mindfulness.\n\nUser Message: {{{userMessage}}}\n\nAvoid giving medical or diagnostic advice.`,
});

const configureAIPersonaFlow = ai.defineFlow(
  {
    name: 'configureAIPersonaFlow',
    inputSchema: ConfigureAIPersonaInputSchema,
    outputSchema: ConfigureAIPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
