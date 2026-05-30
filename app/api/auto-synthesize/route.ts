import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { generateContentWithRetry } from "../../../lib/gemini-runner";
import type { ApiResponse, AutoSynthesizePayload } from "@/lib/api-contracts";

export async function POST(req: NextRequest) {
  try {
    const { artifacts } = await req.json();

    if (!artifacts || !Array.isArray(artifacts) || artifacts.length < 2) {
      return NextResponse.json<ApiResponse<AutoSynthesizePayload>>(
        {
          ok: false,
          error: { message: "At least two artifacts are required for automated synthesis detection." }
        },
        { status: 400 }
      );
    }

    // Prepare a slim representation of all artifacts for the model to index and cluster
    const indexSummary = artifacts.map((art, idx) => {
      return `[ID: ${art.id}]
Title: ${art.title}
Type: ${art.type}
Key Takeaways: ${JSON.stringify(art.keyTakeaways)}
Content Preview (first 150 chars): ${art.content.slice(0, 150).replace(/\n/g, " ")}...
`;
    }).join("\n---\n");

    const promptText = `You are the CaptureFlow Cognitive Automations Dispatcher.
Below are the existing cognitive capture artifacts inside the user's retrieval vault.
Your goal is to inspect their titles, contents, and takeaways, and identify groups of artifacts that are clearly of the SAME subject, project, team conversation, or area of use.

For any groups of artifacts (at least 2 matching artifacts per group) that share high semantic overlap or are part of the same subject/use:
1. Combine and condense them into a SINGLE elegant, unified, highly professional synthesized knowledge artifact.
2. Formulate a cohesive title.
3. Compose the 'content' in clean Markdown (including outlines, code, tables where relevant). Keep headings from Level 2 (##) or 3 (###).
4. Create exactly 3 unified key takeaways.
5. Create aggregate metadata (priority, tools, owners, timeline, value).
6. List the exact IDs of the original artifacts that are incorporated into this group so they can be replaced/deleted.

If there are NO artifacts that share a common subject or overlap in use, return an empty array of groups.
Your output must be structured strictly in JSON, conforming to the provided schema.

Here is the vault database list:
${indexSummary}`;

    const response = await generateContentWithRetry({
      contents: [
        { text: promptText }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            synthesizedGroups: {
              type: Type.ARRAY,
              description: "List of newly synthesized groups. Keep empty if no groups match enough to be combined.",
              items: {
                type: Type.OBJECT,
                properties: {
                  sourceIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of the exact original artifact IDs that were combined to form this unit."
                  },
                  synthesizedArtifact: {
                    type: Type.OBJECT,
                    properties: {
                      title: {
                        type: Type.STRING,
                        description: "A short, precise, descriptive headline for this synthesized/merged artifact."
                      },
                      type: {
                        type: Type.STRING,
                        description: "Category of the combined knowledge artifact. Options: code_snippet, action_items, meeting_summary, data_insights, general_knowledge, contact_info"
                      },
                      content: {
                        type: Type.STRING,
                        description: "The synthesized composite markdown content starting with ## headings. Do not use level 1 headings (#)."
                      },
                      keyTakeaways: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Exactly 3 concise, extremely high-impact takeaways from this aggregated perspective."
                      },
                      metadata: {
                        type: Type.OBJECT,
                        properties: {
                          priority: { type: Type.STRING, description: "High, Medium, or Low representation" },
                          technologiesOrPlatforms: { type: Type.STRING, description: "Consolidated technologies, tools, or libraries (or 'N/A')" },
                          actioneesOrSpeakers: { type: Type.STRING, description: "Consolidated list of owners, speakers, or team members (or 'N/A')" },
                          timeContext: { type: Type.STRING, description: "Aggregated time context or milestone deadline metrics (or 'N/A')" },
                          estimatedValueGauge: { type: Type.STRING, description: "Aggregate strategic focus statement" }
                        },
                        required: ["priority", "technologiesOrPlatforms", "actioneesOrSpeakers"]
                      }
                    },
                    required: ["title", "type", "content", "keyTakeaways", "metadata"]
                  }
                },
                required: ["sourceIds", "synthesizedArtifact"]
              }
            }
          },
          required: ["synthesizedGroups"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response content from automated synthesize AI model.");
    }

    const parsedData = JSON.parse(textOutput.trim()) as AutoSynthesizePayload;
    return NextResponse.json<ApiResponse<AutoSynthesizePayload>>({
      ok: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error("Automated synthesis execution error:", error);
    return NextResponse.json<ApiResponse<AutoSynthesizePayload>>(
      {
        ok: false,
        error: {
          message: "Failed to automatically combine and condense matching artifacts.",
          ...(process.env.NODE_ENV === "development"
            ? { details: error?.message || String(error) }
            : {})
        }
      },
      { status: 500 }
    );
  }
}
