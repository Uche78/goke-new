import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Singleton Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const AI_MODEL = "claude-sonnet-4-6";
export const MAX_TOKENS = 4096;
