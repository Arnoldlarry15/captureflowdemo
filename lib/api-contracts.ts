export interface ArtifactMetadata {
  priority: string;
  technologiesOrPlatforms: string;
  actioneesOrSpeakers: string;
  timeContext?: string;
  estimatedValueGauge?: string;
}

export interface CaptureArtifactPayload {
  title: string;
  type: "code_snippet" | "action_items" | "meeting_summary" | "data_insights" | "general_knowledge" | "contact_info";
  content: string;
  keyTakeaways: string[];
  metadata: ArtifactMetadata;
}

export interface SynthesizedGroupPayload {
  sourceIds: string[];
  synthesizedArtifact: CaptureArtifactPayload;
}

export interface AutoSynthesizePayload {
  synthesizedGroups: SynthesizedGroupPayload[];
}

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    message: string;
    details?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
