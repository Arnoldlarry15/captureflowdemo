import { GoogleGenAI } from "@google/genai";

// Graceful Lazy initialization of GenAI Client
let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a Gemini model query with automatic retries on 503/UNAVAILABLE/overloaded errors,
 * and falls back to a different model (gemini-3.1-flash-lite) if the primary model is completely down.
 */
export async function generateContentWithRetry({
  contents,
  config,
  primaryModel = "gemini-3.5-flash",
  fallbackModel = "gemini-3.1-flash-lite",
  maxRetries = 3
}: {
  contents: any;
  config: any;
  primaryModel?: string;
  fallbackModel?: string;
  maxRetries?: number;
}) {
  const ai = getAiClient();
  const modelsToTry = [primaryModel, fallbackModel];

  let lastError: any = null;

  for (const currentModel of modelsToTry) {
    let delay = 1000; // start with 1000ms backoff
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[GeminiRunner] Attempting generateContent. Model: ${currentModel}, Attempt: ${attempt}/${maxRetries}`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config,
        });
        
        if (response && response.text) {
          console.log(`[GeminiRunner] Success! Generated content using model: ${currentModel}`);
          return response;
        }
        
        throw new Error("Empty response received from generative model.");
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const errStatus = err?.status || err?.code || "";
        
        console.warn(`[GeminiRunner] Warning: Query failed on Model ${currentModel} (Attempt ${attempt}/${maxRetries}). Error details:`, errMsg);

        // Check if the error is retryable: 503, UNAVAILABLE, resource exhausted or overloaded
        const isRetryable = 
          errStatus === 503 ||
          errStatus === "UNAVAILABLE" ||
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("demand") ||
          errMsg.includes("temporary") ||
          errMsg.includes("overloaded") ||
          errMsg.includes("Resource exhausted") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("exhausted");

        if (isRetryable && attempt < maxRetries) {
          console.log(`[GeminiRunner] Error is retryable. Backing off for ${delay}ms...`);
          await sleep(delay);
          delay *= 2; // exponential backoff
        } else {
          // If not retryable or max retries reached, break loop and try next model
          break;
        }
      }
    }
    
    console.warn(`[GeminiRunner] Primary Model ${currentModel} exhausted or non-retryable error encountered. Trying fallback...`);
  }

  // If we arrived here, both primary and fallback models have failed
  console.error("[GeminiRunner] All models and retries failed.", lastError);
  throw lastError || new Error("All generative models failed to respond correctly due to traffic overload.");
}
