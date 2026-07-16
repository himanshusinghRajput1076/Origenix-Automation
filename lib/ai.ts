import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function qualifyLeadWithAI(leadTitle: string, leadDescription: string, url: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      summary: "AI qualification disabled (no API key).",
      qualification: "UNKNOWN"
    };
  }

  try {
    const prompt = `
      You are an expert lead qualifier for a B2B agency. Analyze the following lead/tender:
      
      Title: ${leadTitle}
      URL: ${url}
      Description: ${leadDescription || "No description provided."}

      Please provide:
      1. A very short 2-sentence summary of what this lead needs.
      2. A qualification status: HIGH, MEDIUM, or LOW based on B2B software/agency suitability.

      Format your response exactly as follows:
      SUMMARY: <your 2 sentence summary>
      QUALIFICATION: <HIGH/MEDIUM/LOW>
    `;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt
    });

    const summaryMatch = text.match(/SUMMARY:\s*(.*)/i);
    const qualMatch = text.match(/QUALIFICATION:\s*(HIGH|MEDIUM|LOW)/i);

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : text,
      qualification: qualMatch ? qualMatch[1].toUpperCase() : "MEDIUM"
    };
  } catch (error) {
    console.error("AI qualification error:", error);
    return {
      summary: "AI qualification failed due to an error.",
      qualification: "UNKNOWN"
    };
  }
}
