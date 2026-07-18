import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { streamText } from 'ai';

async function main() {
  const prompt = 'Explain Antigravity in one short sentence.';
  console.log(`Sending prompt: "${prompt}" using model: 'openai/gpt-5.4' via Vercel AI Gateway...\n`);

  try {
    const result = streamText({
      model: 'openai/gpt-5.4',
      prompt: prompt,
    });

    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }

    const usage = await result.usage;
    console.log('\n\n--- Usage Statistics ---');
    console.log(`Prompt Tokens:     ${usage.promptTokens}`);
    console.log(`Completion Tokens: ${usage.completionTokens}`);
    console.log(`Total Tokens:      ${usage.totalTokens}`);
  } catch (error) {
    console.error('\nError during streaming:', error);
  }
}

main();
