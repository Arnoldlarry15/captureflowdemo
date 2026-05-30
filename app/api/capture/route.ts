import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { generateContentWithRetry } from "../../../lib/gemini-runner";
import type { ApiResponse, CaptureArtifactPayload } from "@/lib/api-contracts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { capturedText, croppedImage, appName, captureMetadata } = await req.json();

    const parts: any[] = [];

    // 1. Process image if provided (cropped selection snippet)
    if (croppedImage && typeof croppedImage === 'string') {
      const match = croppedImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }
    }

    // 2. Process text content if provided
    if (capturedText && typeof capturedText === 'string') {
      parts.push({
        text: `Captured Element Text Content:\n"""\n${capturedText}\n"""`
      });
    }

    // 3. Add context prompt
    parts.push({
      text: `You are the CaptureFlow background AI cognitive worker.
Analyze this captured snapshot from the "${appName || 'Desktop'}" window workspace.
Extract all valuable visual data, code, lists, charts, and messages, and assemble them into a highly useful cognitive offloading artifact.
Do not omit details; write highly complete markdown content.
For example:
- If a code trace or snippet is present, extract it perfectly including comments.
- If tabular metrics are visible, structure them as beautiful markdown tables.
- If active tasks or dates are present, compile them into an action item checklist.
- If communication thread is present, compile a concise summary with actionee assignments.

Format the returned JSON according to the schema provided.`
    });

    const response = await generateContentWithRetry({
      contents: parts,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, precise, descriptive headline for this extracted artifact."
            },
            type: {
              type: Type.STRING,
              description: "Category of knowledge artifact. Options: code_snippet, action_items, meeting_summary, data_insights, general_knowledge, contact_info"
            },
            content: {
              type: Type.STRING,
              description: "The core extracted data formatted in gorgeous, complete markdown format. Must be detailed. Use bullet lists, tables, blockquotes, and code blocks as appropriate. Do not use level 1 headings (#), always start headings from level 2 (##) or 3 (###)."
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 concise, high-impact semantic takeaways from this captured source."
            },
            metadata: {
              type: Type.OBJECT,
              properties: {
                priority: {
                  type: Type.STRING,
                  description: "Urgency evaluation: High, Medium, or Low"
                },
                technologiesOrPlatforms: {
                  type: Type.STRING,
                  description: "Extracted technologies, software, or tools mentioned (or 'N/A' if none)"
                },
                actioneesOrSpeakers: {
                  type: Type.STRING,
                  description: "People mentioned as taking action or speaking (or 'N/A')"
                },
                timeContext: {
                  type: Type.STRING,
                  description: "Dates, deadlines, or times specified (or 'N/A')"
                },
                estimatedValueGauge: {
                  type: Type.STRING,
                  description: "A quick metric of estimated value or focus weight (e.g., 'Core Dev Path', 'high strategic value')"
                }
              },
              required: ["priority", "technologiesOrPlatforms", "actioneesOrSpeakers"]
            }
          },
          required: ["title", "type", "content", "keyTakeaways", "metadata"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response text from Gemini API");
    }

    const parsedData = JSON.parse(textOutput.trim()) as CaptureArtifactPayload;
    return NextResponse.json<ApiResponse<CaptureArtifactPayload>>({
      ok: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error("Capture Flow extraction error:", error);
    return NextResponse.json<ApiResponse<CaptureArtifactPayload>>(
      {
        ok: false,
        error: {
          message: "Failed to extract cognitive data.",
          ...(process.env.NODE_ENV === "development"
            ? { details: error?.message || String(error) }
            : {})
        }
      },
      { status: 500 }
    );
  }
}
