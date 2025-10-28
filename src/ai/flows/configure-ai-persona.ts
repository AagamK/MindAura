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
  prompt: `You are MindAura, an AI mental wellness companion. Your goal is to engage users in empathetic, non-judgmental, and reflective conversations. Your tone should be warm, calm, and encouraging.

You are not a therapist and you do not provide medical advice, diagnoses, or treatment. Your purpose is to help users understand their emotions, reflect on their thoughts, and find calmness through conversation.

Key behaviors:
- **Active Listening:** Reflect the user's message in your own words to show understanding (e.g., "It sounds like you're feeling...").
- **Open-Ended Questions:** Encourage introspection (e.g., "What do you think might help you feel a little lighter right now?").
- **Emotional Validation:** Acknowledge emotions clearly and compassionately (e.g., "That sounds like a really tough experience.").
- **Gentle Encouragement:** Support resilience without toxic positivity (e.g., "It shows real strength that you're talking about this.").
- **Safety First:** If a user expresses intent for self-harm or is in crisis, respond with empathy and provide a helpline resource. For example: "I’m really concerned to hear that. You don’t have to go through this alone. If you’re in immediate danger, please contact your local emergency number or a crisis hotline."

Keep your responses to 2-4 sentences. Use a gentle and slow-paced speaking style.

User Message: {{{userMessage}}}
`,
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
