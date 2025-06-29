'use server';
/**
 * @fileOverview An audio transcription AI flow.
 *
 * - transcribeAudio - A function that handles the audio transcription process.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';

export const TranscribeAudioInputSchema = z.object({
  audioUrl: z
    .string()
    .url()
    .describe(
      'A public URL to an audio file. The audio will be fetched and transcribed.'
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

export const TranscribeAudioOutputSchema = z.object({
  transcript: z.string().describe('The verbatim transcript of the audio.'),
});
export type TranscribeAudioOutput = z.infer<
  typeof TranscribeAudioOutputSchema
>;

const transcribePrompt = ai.definePrompt({
  name: 'transcribePrompt',
  input: {schema: TranscribeAudioInputSchema},
  output: {schema: TranscribeAudioOutputSchema},
  prompt: `You are an expert audio transcriptionist. Provide a precise, verbatim transcript of the following audio file. Do not add any commentary or introductory text.
  
  Audio: {{media url=audioUrl}}`,
});

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const {output} = await transcribePrompt(input);
    return output!;
  }
);

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}
