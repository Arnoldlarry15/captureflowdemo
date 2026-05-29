"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { ApiResponse, AutoSynthesizePayload, CaptureArtifactPayload } from "@/lib/api-contracts";
import { 
  Crop, 
  Terminal, 
  BarChart3, 
  MessageSquare, 
  Image as ImageIcon, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Play, 
  RefreshCw, 
  CornerDownRight, 
  Plus, 
  FileText, 
  AlertCircle, 
  CheckSquare, 
  Cpu, 
  Maximize2,
  X,
  Database,
  Layers,
  HelpCircle
} from "lucide-react";

// Definitions
interface KnowledgeArtifact {
  id: string;
  title: string;
  type: "code_snippet" | "action_items" | "meeting_summary" | "data_insights" | "general_knowledge" | "contact_info";
  content: string;
  keyTakeaways: string[];
  metadata: {
    priority: string;
    technologiesOrPlatforms: string;
    actioneesOrSpeakers: string;
    timeContext: string;
    estimatedValueGauge: string;
  };
  capturedAt: string;
  sourceApp: string;
}

interface SimulatedTask {
  id: string;
  text: string;
  completed: boolean;
  sourceArtifactTitle?: string;
}

// Initial realistic default database
const INITIAL_ARTIFACTS: KnowledgeArtifact[] = [
  {
    id: "art-1",
    title: "Next.js 15 Standalone Proxy Middleware",
    type: "code_snippet",
    content: `## Next.js API Middleware Telemetry Proxy

Optimizes caching policies and maps telemetry identifiers through to the core API runtime.

\`\`\`typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Extract custom telemetry identifier tags
  const traceId = request.headers.get("x-flow-trace") || "trace_ambient_0fx";
  
  return NextResponse.json({
    status: "active",
    workerState: "idle",
    timestamp: new Date().toISOString()
  }, {
    headers: {
      "X-Cache-Status": "HIT",
      "X-Trace-Id": traceId,
      "Cache-Control": "public, max-age=3600"
    }
  });
}
\`\`\``,
    keyTakeaways: [
      "Secures custom request telemetry tags cleanly through public-facing edge proxies.",
      "Optimized standard caching parameters to a 3600-second maximum lifespan.",
      "Uses Next.js 15 App Router standard headers mapped directly into the NextResponse handler."
    ],
    metadata: {
      priority: "Low",
      technologiesOrPlatforms: "Next.js, TypeScript",
      actioneesOrSpeakers: "Core Dev Group",
      timeContext: "Deployed 2026-05-29",
      estimatedValueGauge: "Developer productivity pattern"
    },
    capturedAt: "2026-05-29T02:45:00Z",
    sourceApp: "Developer Terminal"
  },
  {
    id: "art-2",
    title: "Core Deliverables & Bug Remediation Tasks",
    type: "action_items",
    content: `## Actionable Objectives & Followups

From sprint review discussion on optimizing local layout and asset pipeline performance.

- [x] Configure image optimization RemotePatterns in next.config.ts.
- [ ] Implement lazy client initialization on third-party SDK packages.
- [ ] Connect custom screenshot cropped regions to local state storage manager.`,
    keyTakeaways: [
      "Avoid modules crashes by delaying client loading until components mount.",
      "Ensure all asset paths are whitelisted inside Next configuration wrappers.",
      "Build a clean Canvas context extraction service for subsegment croppings."
    ],
    metadata: {
      priority: "High",
      technologiesOrPlatforms: "React, Next.js, Canvas API",
      actioneesOrSpeakers: "Sarah, Alex, Elena",
      timeContext: "Due by June 12",
      estimatedValueGauge: "Primary launch path blockers"
    },
    capturedAt: "2026-05-29T01:10:00Z",
    sourceApp: "Productivity Chat"
  }
];

// Clean external helper to prevent react-hooks/purity warnings
function generateUniqueId(prefix: string, indexOffset = 0): string {
  const timestamp = typeof Date !== "undefined" ? Date.now() : Math.floor(Math.random() * 1000000);
  const randNum = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${randNum}-${indexOffset}`;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const parsed = await response.json();

  if (parsed && typeof parsed === "object" && "ok" in parsed) {
    const apiResponse = parsed as ApiResponse<T>;
    if (apiResponse.ok) {
      return apiResponse.data;
    }
    throw new Error(apiResponse.error.message || "Request failed.");
  }

  if (!response.ok) {
    let errMsg = "Request failed.";
    if (parsed && typeof parsed === "object" && "error" in parsed) {
      const apiError = parsed.error;
      if (typeof apiError === "string") {
        errMsg = apiError;
      } else if (apiError && typeof apiError === "object" && "message" in apiError && typeof apiError.message === "string") {
        errMsg = apiError.message;
      }
    }
    throw new Error(errMsg);
  }

  return parsed as T;
}

export default function CaptureFlowApp() {
  // App states
  const [isMounted, setIsMounted] = useState(false);
  const [artifacts, setArtifacts] = useState<KnowledgeArtifact[]>(INITIAL_ARTIFACTS);
  const [activeArtifactId, setActiveArtifactId] = useState<string>("art-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  
  // Custom generated tasks from artifacts
  const [tasks, setTasks] = useState<SimulatedTask[]>([]);

  // Custom persistent saves check
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedArt = localStorage.getItem("captureflow_artifacts");
      if (storedArt) {
        try {
          const parsed = JSON.parse(storedArt);
          if (parsed && parsed.length > 0) setArtifacts(parsed);
        } catch (_) {}
      }
      const storedTasks = localStorage.getItem("captureflow_tasks");
      if (storedTasks) {
        try {
          setTasks(JSON.parse(storedTasks));
        } catch (_) {}
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("captureflow_artifacts", JSON.stringify(artifacts));
    }
  }, [artifacts, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("captureflow_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  // System alert states
  const [systemAlert, setSystemAlert] = useState<{message: string; type: "success" | "error" | "info"} | null>(null);

  // Layout presentation controls
  const [isDbOpen, setIsDbOpen] = useState(false); // Database does not automatically pop up! Close by default.
  const [toastMessage, setToastMessage] = useState<{title: string; desc: string} | null>(null);
  const [vaultTab, setVaultTab] = useState<"insight" | "checklist">("insight");

  // Deletion confirmations and synthesis states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null); // ID or 'clear-all' or 'clear-selected'
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedArtifactIds, setSelectedArtifactIds] = useState<string[]>([]);
  const [isAutoSynthesizing, setIsAutoSynthesizing] = useState(false);

  // Capture mode variables
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [captureStartPos, setCaptureStartPos] = useState({ x: 0, y: 0 });
  const [captureCurrentPos, setCaptureCurrentPos] = useState({ x: 0, y: 0 });
  const [dragActive, setDragActive] = useState(false);
  const [activeCaptureApp, setActiveCaptureApp] = useState<string>("Unknown Application");
  const [activeCaptureContext, setActiveCaptureContext] = useState<string>("");

  // Right-click simulated Context Menu position
  const [contextMenu, setContextMenu] = useState<{x: number; y: number} | null>(null);
  const [selectedText, setSelectedText] = useState("");

  // Simulated Live Workplace variables
  const [chatMessages, setChatMessages] = useState([
    { author: "Alex (System Architect)", text: "Team, can we review the Next.js standup trace error logs? It blocks telemetry compilation.", time: "09:12" },
    { author: "Elena (Core Dev)", text: "Sure! Alex, let's construct standard middleware proxies. It safeguards against API keys leak.", time: "09:14" },
    { author: "You (Ambient Observer)", text: "Let's capture this section using CaptureFlow! Press Alt+C and crop over our discussion.", time: "09:16" }
  ]);
  const [chatInput, setChatInput] = useState("");
  
  const [compilerLogs, setCompilerLogs] = useState<string[]>([
    "CF-Runtime Primitive initial parameters validated...",
    "[STATUS] Local compilation node actively listening...",
    "[Compiler] Error: build failed inside middle_telemetry.ts:16",
    ">> 16 | const userToken = req.headers.get('Authorization')!",
    ">>    |                       ^ null pointer evaluation trace",
    "[System Code State] Waiting for CaptureFlow extraction fix..."
  ]);
  const [isCrashActive, setIsCrashActive] = useState(true);

  // User screenshot uploads
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const uploadContainerRef = useRef<HTMLDivElement>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Trigger non-intrusive alert
  const triggerSystemAlert = (message: string, type: "success" | "error" | "info" = "success") => {
    setSystemAlert({ message, type });
    setTimeout(() => setSystemAlert(null), 4500);
  };

  // Toast notifier for background processing milestones
  const showBackgroundToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Right-click handler inside Desktop Simulated Canvas
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!desktopRef.current) return;
    const rect = desktopRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Detect old fashioned standard text selection
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    setSelectedText(text);

    setContextMenu({ x, y });
  };

  // Instant capture without dragging cropped region
  const handleContextCapture = async (textToExtract: string, isFromSelection: boolean) => {
    setContextMenu(null);
    setIsProcessing(true);
    
    const sourceApp = isFromSelection ? "Selected Screen Text" : "Full Screen Context";
    
    showBackgroundToast(
      "📸 Capture Registered",
      isFromSelection 
        ? "Selected text context acquired. Converting to knowledge segment..."
        : "Extracting complete desktop workspace text natively into retrieval vault..."
    );

    try {
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capturedText: textToExtract,
          croppedImage: null,
          appName: sourceApp,
          captureMetadata: { width: 500, height: 350 }
        })
      });

      const rawExtract = await parseApiResponse<CaptureArtifactPayload>(response);
      const uniqueId = generateUniqueId("art-dispatched");
      
      const novelArtifact: KnowledgeArtifact = {
        id: uniqueId,
        title: rawExtract.title || `${sourceApp} Capture Extract`,
        type: rawExtract.type || "general_knowledge",
        content: rawExtract.content || textToExtract,
        keyTakeaways: rawExtract.keyTakeaways || ["Background AI extraction completed."],
        metadata: {
          priority: rawExtract.metadata?.priority || "Medium",
          technologiesOrPlatforms: rawExtract.metadata?.technologiesOrPlatforms || "N/A",
          actioneesOrSpeakers: rawExtract.metadata?.actioneesOrSpeakers || "N/A",
          timeContext: rawExtract.metadata?.timeContext || "N/A",
          estimatedValueGauge: rawExtract.metadata?.estimatedValueGauge || "Instant capture clip"
        },
        capturedAt: new Date().toISOString(),
        sourceApp: sourceApp
      };

      setArtifacts(prev => [novelArtifact, ...prev]);
      setActiveArtifactId(novelArtifact.id);

      showBackgroundToast(
        "✨ Filed & Organized",
        `Parsed insight "${novelArtifact.title}" indexed. Access via context menu or Retrieval Vault.`
      );
    } catch (e) {
      console.error(e);
      showBackgroundToast(
        "❌ OCR Fallback Compiled",
        "Saved snapshot of selected text directly inside your retrieval vault feed."
      );
      
      const fallbackId = generateUniqueId("fallback");
      const fallbackArt: KnowledgeArtifact = {
        id: fallbackId,
        title: isFromSelection ? "Standard Selected Text Clip" : "Instant Screen Content Capture",
        type: "general_knowledge",
        content: `## Captured Native Text Segment\n\n${textToExtract}`,
        keyTakeaways: ["Instant cognitive clip recorded", "No crop region needed", "Saved in standard retrieval vault"],
        metadata: {
          priority: "Medium",
          technologiesOrPlatforms: "N/A",
          actioneesOrSpeakers: "N/A",
          timeContext: new Date().toLocaleTimeString(),
          estimatedValueGauge: "Direct text extraction"
        },
        capturedAt: new Date().toISOString(),
        sourceApp: sourceApp
      };
      setArtifacts(prev => [fallbackArt, ...prev]);
      setActiveArtifactId(fallbackId);
    } finally {
      setIsProcessing(false);
    }
  };

  // Initiate selection capturing overlay
  const startCaptureFlow = () => {
    setIsCapturing(true);
    setDragActive(false);
    setContextMenu(null);
    triggerSystemAlert("Drag a selection box over any screen context to crop & capture.", "info");
  };

  const cancelCaptureFlow = () => {
    setIsCapturing(false);
    setDragActive(false);
  };

  // Global Keybind listeners helper
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // ALT + C triggers capture flow
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        startCaptureFlow();
      }
      // ESC cancels current capture
      if (e.key === "Escape" && isCapturing) {
        cancelCaptureFlow();
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCapturing]);

  // Click outside listener to dismiss context menu
  useEffect(() => {
    const clearMenu = () => setContextMenu(null);
    window.addEventListener("click", clearMenu);
    return () => window.removeEventListener("click", clearMenu);
  }, []);

  // Mouse capture handlers inside workspace bounds
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCapturing) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCaptureStartPos({ x, y });
    setCaptureCurrentPos({ x, y });
    setDragActive(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCapturing || !dragActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setCaptureCurrentPos({ x, y });

    // Live viewport overlap checking
    checkCurrentQuadrant(rect, {
      x1: Math.min(captureStartPos.x, x),
      y1: Math.min(captureStartPos.y, y),
      x2: Math.max(captureStartPos.x, x),
      y2: Math.max(captureStartPos.y, y)
    });
  };

  const checkCurrentQuadrant = (bounds: DOMRect, area: {x1: number; y1: number; x2: number; y2: number}) => {
    const w = bounds.width;
    const h = bounds.height;
    const cx = (area.x1 + area.x2) / 2;
    const cy = (area.y1 + area.y2) / 2;

    if (uploadedImage && cx > w * 0.48 && cy > h * 0.48) {
      setActiveCaptureApp("Custom Upload Sandbox");
      setActiveCaptureContext("Custom workspace snapshot supplied by customer. Initiating Gemini OCR extraction...");
      return;
    }

    if (cx < w / 2) {
      if (cy < h / 2) {
        setActiveCaptureApp("System Editor Code Console");
        setActiveCaptureContext(compilerLogs.join("\n"));
      } else {
        setActiveCaptureApp("Co-author Standup Chat Context");
        setActiveCaptureContext(chatMessages.map(m => `${m.author}: ${m.text}`).join("\n"));
      }
    } else {
      if (cy < h / 2) {
        setActiveCaptureApp("Sales & ARR Traction Metrics");
        setActiveCaptureContext("Simulated transaction metric overview segment.\nConversion metric: 5.48%\nActive concurrent node users: 1,842\nARR indicator totals: $3.15M");
      } else {
        setActiveCaptureApp("Whitepaper Alignment Abstract");
        setActiveCaptureContext("The cognitive performance layer represents a major development boundary. Models must prefer standalone, lazy initialization sequences. Sync checks on storage units prevent telemetry loss.");
      }
    }
  };

  const handleMouseUp = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCapturing || !dragActive) return;
    setDragActive(false);
    setIsCapturing(false);

    const w = Math.abs(captureCurrentPos.x - captureStartPos.x);
    const h = Math.abs(captureCurrentPos.y - captureStartPos.y);

    if (w < 20 || h < 20) {
      triggerSystemAlert("Cropping zone too small. Please drag a larger selection segment.", "error");
      return;
    }

    // Enter silent background processing phase instantly
    setIsProcessing(true);
    showBackgroundToast(
      "📸 Capture Registered",
      `Region acquired from "${activeCaptureApp}". Extracting cognitive data silently...`
    );

    let croppedBase64: string | null = null;
    if (uploadedImage && activeCaptureApp === "Custom Upload Sandbox") {
      try {
        croppedBase64 = await triggerCanvasCrop();
      } catch (err) {
        console.warn("Canvas crop exception, falling back:", err);
      }
    }

    // Silently proceed API dispatch in the background (will not block nor pop up the database window!)
    try {
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capturedText: activeCaptureContext,
          croppedImage: croppedBase64 || (uploadedImage && activeCaptureApp === "Custom Upload Sandbox" ? uploadedImage : null),
          appName: activeCaptureApp,
          captureMetadata: { width: w, height: h }
        })
      });

      const rawExtract = await parseApiResponse<CaptureArtifactPayload>(response);
      const uniqueId = generateUniqueId("art-dispatched");
      
      const novelArtifact: KnowledgeArtifact = {
        id: uniqueId,
        title: rawExtract.title || `${activeCaptureApp} Capture Extract`,
        type: rawExtract.type || "general_knowledge",
        content: rawExtract.content || "Placeholder content response.",
        keyTakeaways: rawExtract.keyTakeaways || ["Extracted text filed cleanly."],
        metadata: {
          priority: rawExtract.metadata?.priority || "Medium",
          technologiesOrPlatforms: rawExtract.metadata?.technologiesOrPlatforms || "N/A",
          actioneesOrSpeakers: rawExtract.metadata?.actioneesOrSpeakers || "N/A",
          timeContext: rawExtract.metadata?.timeContext || "N/A",
          estimatedValueGauge: rawExtract.metadata?.estimatedValueGauge || "Ambient capture catalog"
        },
        capturedAt: new Date().toISOString(),
        sourceApp: activeCaptureApp
      };

      setArtifacts(prev => [novelArtifact, ...prev]);
      setActiveArtifactId(novelArtifact.id);

      // Trigger standard silent completed indicator
      showBackgroundToast(
        "✨ Filed & Organized",
        `Parsed insight "${novelArtifact.title}" indexed. Access via context menu or Retrieval Vault.`
      );

      // Handle interactive mock compiler auto-resolution if they cropped the error block
      if (activeCaptureApp === "System Editor Code Console" && isCrashActive) {
        setIsCrashActive(false);
        setCompilerLogs([
          "CF-Runtime Primitive initial parameters validated...",
          "[STATUS] Local compilation node actively listening...",
          "[Success] AI code fix automatically applied!",
          "[STATUS] Assembly completed (zero errors detected)"
        ]);
        showBackgroundToast("🛠️ Error Resolved", "The compiler error has been automatically patched using AI-interpreted hotfix.");
      }

    } catch (error: any) {
      console.error(error);
      showBackgroundToast(
        "❌ Deep OCR Fallback Completed (Warning)",
        "Could not contact online Gemini, saved snapshot with raw client OCR fallback rules."
      );
      // Create raw fallback
      const fallbackId = generateUniqueId("fallback");
      const fallbackArt: KnowledgeArtifact = {
        id: fallbackId,
        title: `Raw text capture from ${activeCaptureApp}`,
        type: "general_knowledge",
        content: `## Extracted Raw Region Text\n\n\`\`\`\n${activeCaptureContext || 'No raw text parsed.'}\n\`\`\``,
        keyTakeaways: ["Extracted via offline client fallback engine successfully."],
        metadata: {
          priority: "Medium",
          technologiesOrPlatforms: "Local OCR",
          actioneesOrSpeakers: "N/A",
          timeContext: "N/A",
          estimatedValueGauge: "Minimal priority tier"
        },
        capturedAt: new Date().toISOString(),
        sourceApp: activeCaptureApp
      };
      setArtifacts(prev => [fallbackArt, ...prev]);
      setActiveArtifactId(fallbackArt.id);
    } finally {
      setIsProcessing(false);
    }
  };

  // Crop calculation helper for custom image uploads
  const triggerCanvasCrop = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = uploadedImage!;
      img.onload = () => {
        try {
          const workspace = desktopRef.current;
          const uploader = uploadContainerRef.current;
          if (!workspace || !uploader) return resolve(null);

          const workRect = workspace.getBoundingClientRect();
          const upRect = uploader.getBoundingClientRect();

          const x1 = Math.min(captureStartPos.x, captureCurrentPos.x);
          const y1 = Math.min(captureStartPos.y, captureCurrentPos.y);
          const x2 = Math.max(captureStartPos.x, captureCurrentPos.x);
          const y2 = Math.max(captureStartPos.y, captureCurrentPos.y);

          const containerOffsetLeft = upRect.left - workRect.left;
          const containerOffsetTop = upRect.top - workRect.top;

          const intersectX1 = Math.max(x1, containerOffsetLeft) - containerOffsetLeft;
          const intersectY1 = Math.max(y1, containerOffsetTop) - containerOffsetTop;
          const intersectX2 = Math.min(x2, containerOffsetLeft + upRect.width) - containerOffsetLeft;
          const intersectY2 = Math.min(y2, containerOffsetTop + upRect.height) - containerOffsetTop;

          const iw = intersectX2 - intersectX1;
          const ih = intersectY2 - intersectY1;

          if (iw < 10 || ih < 10) return resolve(null);

          const scaleX = img.width / upRect.width;
          const scaleY = img.height / upRect.height;

          const canvas = document.createElement("canvas");
          canvas.width = iw * scaleX;
          canvas.height = ih * scaleY;

          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);

          ctx.drawImage(
            img,
            intersectX1 * scaleX,
            intersectY1 * scaleY,
            iw * scaleX,
            ih * scaleY,
            0,
            0,
            iw * scaleX,
            ih * scaleY
          );
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } catch (e) {
          console.error(e);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
    });
  };

  // Custom User File Upload Triggering
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fr = new FileReader();
      fr.onload = () => {
        setUploadedImage(fr.result as string);
        triggerSystemAlert("Real capture environment loaded. Select 'Invoke Capture' and drag over your crop region.", "success");
      };
      fr.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      setUploadedImage(imageUrlInput);
      setImageUrlInput("");
      triggerSystemAlert("Online custom screenshot loaded successfully into selection box.", "success");
    }
  };

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerSystemAlert("Copied markdown content representation successfully.", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadPayloadJSON = (art: KnowledgeArtifact) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(art, null, 2));
    const dlLink = document.createElement("a");
    dlLink.setAttribute("href", dataStr);
    dlLink.setAttribute("download", `cf-export-${art.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`);
    document.body.appendChild(dlLink);
    dlLink.click();
    dlLink.remove();
    triggerSystemAlert("Artifact payload saved to files.", "success");
  };

  const initiateDiscardArtifact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDiscardArtifact = () => {
    if (!deleteConfirmId) return;
    if (deleteConfirmId === "clear-all") {
      setArtifacts([]);
      setActiveArtifactId("");
      triggerSystemAlert("All retrieval vault segments purged.", "info");
    } else if (deleteConfirmId === "clear-selected") {
      const remainingDocs = artifacts.filter(art => !selectedArtifactIds.includes(art.id));
      setArtifacts(remainingDocs);
      triggerSystemAlert(`${selectedArtifactIds.length} segments deleted from your vault feed.`, "info");
      
      if (selectedArtifactIds.includes(activeArtifactId)) {
        if (remainingDocs.length > 0) {
          setActiveArtifactId(remainingDocs[0].id);
        } else {
          setActiveArtifactId("");
        }
      }
      setSelectedArtifactIds([]);
      setIsSelectMode(false);
    } else {
      const targetId = deleteConfirmId;
      setArtifacts(prev => prev.filter(x => x.id !== targetId));
      triggerSystemAlert("Insight segment deleted successfully.", "info");
      if (activeArtifactId === targetId) {
        const rem = artifacts.filter(x => x.id !== targetId);
        if (rem.length > 0) {
          setActiveArtifactId(rem[0].id);
        } else {
          setActiveArtifactId("");
        }
      }
    }
    setDeleteConfirmId(null);
  };

  const runAutomatedSynthesis = async () => {
    if (artifacts.length < 2) {
      triggerSystemAlert("At least 2 segments are required in the vault to run automated synthesis.", "error");
      return;
    }
    setIsAutoSynthesizing(true);
    triggerSystemAlert("Gemini is examining all segments for related subject/use patterns with auto-clumping...", "info");
    try {
      const res = await fetch("/api/auto-synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artifacts })
      });

      const parsed = await parseApiResponse<AutoSynthesizePayload>(res);
      const groups = parsed.synthesizedGroups || [];
      if (groups.length === 0) {
        triggerSystemAlert("Gemini examined all segments and found no related subjects/use that require combined synthesis.", "info");
        return;
      }

      // Process automatic group synthesis results
      let updatedArtifacts = [...artifacts];
      let brandNewActiveId = "";

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const newId = generateUniqueId("art-auto-condensed", i);
        const synthesized = group.synthesizedArtifact;
        const compositeArtifact: KnowledgeArtifact = {
          ...synthesized,
          metadata: {
            priority: synthesized.metadata?.priority ?? "Medium",
            technologiesOrPlatforms: synthesized.metadata?.technologiesOrPlatforms ?? "N/A",
            actioneesOrSpeakers: synthesized.metadata?.actioneesOrSpeakers ?? "N/A",
            timeContext: synthesized.metadata?.timeContext ?? "N/A",
            estimatedValueGauge: synthesized.metadata?.estimatedValueGauge ?? "Synthesized cluster"
          },
          id: newId,
          capturedAt: new Date().toISOString(),
          sourceApp: "Automated Gemini Cognitive Engine"
        };

        // Filter out original sources consumed in this group
        updatedArtifacts = updatedArtifacts.filter(art => !group.sourceIds.includes(art.id));
        // Add new composite
        updatedArtifacts = [compositeArtifact, ...updatedArtifacts];
        brandNewActiveId = newId;
      }

      setArtifacts(updatedArtifacts);
      if (brandNewActiveId) {
        setActiveArtifactId(brandNewActiveId);
      }
      triggerSystemAlert(`Gemini successfully grouped and auto-synthesized ${groups.length} matching subjects!`, "success");
    } catch (error: any) {
      console.error(error);
      triggerSystemAlert("Failed to execute automatic synthesis.", "error");
    } finally {
      setIsAutoSynthesizing(false);
    }
  };

  const toggleSelectArtifact = (id: string) => {
    setSelectedArtifactIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleTaskState = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    triggerSystemAlert("Task checklist status altered.", "success");
  };

  const fillFollowupsFromArtifact = (art: KnowledgeArtifact) => {
    const targets = art.keyTakeaways.length > 0 ? art.keyTakeaways : ["Identify spec outcomes for " + art.title];
    const createdTasks = targets.map((takeaway, i) => ({
      id: generateUniqueId("task-gen", i),
      text: takeaway,
      completed: false,
      sourceArtifactTitle: art.title
    }));

    setTasks(prev => [...prev, ...createdTasks]);
    setVaultTab("checklist");
    triggerSystemAlert(`Integrated ${createdTasks.length} followup targets dynamically into active tasks.`, "success");
  };

  const addManualTask = (text: string) => {
    if (!text.trim()) return;
    const item: SimulatedTask = {
      id: generateUniqueId("task-manual"),
      text,
      completed: false,
      sourceArtifactTitle: "Manual Desk Sticky"
    };
    setTasks(prev => [item, ...prev]);
    triggerSystemAlert("Manually documented goal saved.", "success");
  };

  const postSimulatedStandupChat = () => {
    if (!chatInput.trim()) return;
    const log = {
      author: "You (Reviewer)",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, log]);
    setChatInput("");
    triggerSystemAlert("Standup message updated. ALT+C allows cropping it instantly.", "success");
  };

  const toggleCrashCodeSim = () => {
    setIsCrashActive(true);
    setCompilerLogs([
      "CF-Runtime Primitive initial parameters validated...",
      "[STATUS] Local compilation node actively listening...",
      "[Compiler] Error: build failed inside middle_telemetry.ts:16",
      ">> 16 | const userToken = req.headers.get('Authorization')!",
      ">>    |                       ^ null pointer evaluation trace",
      "[System Code State] Waiting for CaptureFlow extraction fix..."
    ]);
    triggerSystemAlert("Restored code incident logs inside IDE console editor.", "info");
  };

  // Searching logic
  const matchFuzzyQuery = artifacts.filter(art => {
    const term = searchQuery.toLowerCase();
    const doesMatch = 
      art.title.toLowerCase().includes(term) ||
      art.content.toLowerCase().includes(term) ||
      art.sourceApp.toLowerCase().includes(term) ||
      art.metadata.technologiesOrPlatforms.toLowerCase().includes(term);
    
    if (selectedTypeFilter === "all") return doesMatch;
    return doesMatch && art.type === selectedTypeFilter;
  });

  const activeArtifact = artifacts.find(art => art.id === activeArtifactId) || artifacts[0];

  const getBadgeColors = (type: string) => {
    switch (type) {
      case "code_snippet": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "action_items": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "data_insights": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "meeting_summary": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "contact_info": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Sync Markdown layout parsing
  const displayStructuredText = (inp: string) => {
    if (!inp) return null;
    const lines = inp.split("\n");
    let inCode = false;
    let codeBlockText: string[] = [];

    return lines.map((l, i) => {
      if (l.startsWith("```")) {
        if (inCode) {
          inCode = false;
          const node = (
            <div key={`code-snippet-${i}`} className="my-3 overflow-hidden rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between bg-slate-900 px-3 py-1 text-slate-400 border-b border-slate-800 text-[10px]">
                <span>Extracted Syntax Content</span>
                <button 
                  onClick={() => handleCopyToClipboard(codeBlockText.join("\n"), `block-${i}`)}
                  className="p-1 hover:text-white transition-all active:scale-95 text-slate-500"
                  title="Copy Syntax"
                >
                  <Copy size={11} />
                </button>
              </div>
              <pre className="p-3 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed font-mono">
                <code>{codeBlockText.join("\n")}</code>
              </pre>
            </div>
          );
          codeBlockText = [];
          return node;
        } else {
          inCode = true;
          return null;
        }
      }

      if (inCode) {
        codeBlockText.push(l);
        return null;
      }

      if (l.startsWith("- [ ]") || l.startsWith("- [x]")) {
        const isDone = l.startsWith("- [x]");
        const text = l.replace(/^- \[( |x)\] /, "");
        return (
          <div key={i} className="flex items-center gap-2 py-0.5 font-sans text-xs text-slate-300">
            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-600"}`}>
              {isDone && <Check size={8} strokeWidth={3} />}
            </span>
            <span className={isDone ? "line-through text-slate-500" : "text-slate-200"}>{text}</span>
          </div>
        );
      }

      if (l.startsWith("- ") || l.startsWith("* ")) {
        return (
          <li key={i} className="ml-4 list-disc py-0.5 font-sans text-xs text-slate-300">
            {l.substring(2)}
          </li>
        );
      }

      if (l.startsWith("## ")) {
        return (
          <h4 key={i} className="text-xs font-semibold text-slate-200 border-l-2 border-blue-500 pl-2 mt-4 mb-2 uppercase tracking-wide">
            {l.substring(3)}
          </h4>
        );
      }

      if (l.trim() === "") return <div key={i} className="h-1" />;
      return (
        <p key={i} className="text-xs text-slate-300 leading-relaxed font-sans mb-1.5">
          {l}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#07090E] select-none flex flex-col justify-start">
      
      {/* Floating alert flags */}
      <AnimatePresence>
        {systemAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-2xl text-[11px] font-semibold tracking-wide ${
              systemAlert.type === 'error' 
                ? "bg-rose-950/90 border-rose-800 text-rose-200" 
                : systemAlert.type === 'info' 
                  ? "bg-slate-900/90 border-slate-700 text-slate-200"
                  : "bg-emerald-950/90 border-emerald-800 text-emerald-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              systemAlert.type === 'error' ? 'bg-rose-400' : systemAlert.type === 'info' ? 'bg-blue-400' : 'bg-emerald-400'
            } animate-ping`} />
            <span>{systemAlert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating silent notification of background worker activity */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 100 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-blue-500/40 rounded-xl p-4 shadow-2xl max-w-sm flex items-start gap-3"
          >
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg animate-pulse shrink-0">
              <Cpu size={16} />
            </div>
            <div>
              <h5 className="text-[11px] font-bold text-slate-100 flex items-center gap-1.5">
                {toastMessage.title}
                <Sparkles size={10} className="text-blue-400 animate-spin" />
              </h5>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{toastMessage.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core OS Workspace Wrapper */}
      <div className="flex-1 w-full flex flex-col p-4 max-w-[1400px] mx-auto gap-4">
        
        {/* Ambient Top Bar */}
        <header className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-3.5 backdrop-blur-md shadow-lg shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative">
              <Image 
                src="/logo.svg" 
                alt="CaptureFlow Logo" 
                width={32}
                height={32}
                referrerPolicy="no-referrer"
                className="object-contain filter drop-shadow-[0_0_8px_rgba(0,255,255,0.25)] select-none" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-200 font-display flex items-center gap-2 select-none">
                CaptureFlow
                <span className="text-[8.5px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono font-bold uppercase select-none">
                  v0.9.0 OS Primitive
                </span>
              </span>
            </div>
          </div>

          {/* Guide helper */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-sans text-slate-400">
            <span className="flex items-center gap-1">
              <span className="bg-slate-800 border border-slate-700 text-[10px] px-1.5 py-0.5 rounded text-slate-300 font-mono font-bold">ALT + C</span>
            </span>
            <span className="text-slate-800">|</span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles size={11} className="text-blue-500" />
              Drag rect over simulated console or upload files. Extraction runs silently in background.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Database Vault Toggle Button */}
            <button
              onClick={() => setIsDbOpen(!isDbOpen)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95 border ${
                isDbOpen 
                  ? "bg-blue-600 text-white border-blue-500" 
                  : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:text-white"
              }`}
            >
              <Database size={13} />
              Open Retrieval Vault
              {artifacts.length > 0 && (
                <span className="ml-1 bg-slate-950 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {artifacts.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Workspace Area: Wallpaper + Layout Windows Grid */}
        <div 
          ref={desktopRef}
          onContextMenu={handleDesktopContextMenu}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`flex-1 relative bg-gradient-to-br from-[#0c0e17] via-[#04060b] to-black border border-slate-800/80 rounded-3xl h-[610px] min-h-[580px] overflow-hidden p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 group transition-all shadow-2xl ${
            isCapturing ? "cursor-default ring-2 ring-blue-500 ring-offset-4 ring-offset-black scale-[0.998]" : "cursor-default"
          }`}
        >
          
          {/* WINDOW 1: Monochrome Developer Terminal Code emulator */}
          <div className={`lg:col-span-4 bg-[#0a0c10] text-slate-300 rounded-2xl border p-3.5 flex flex-col justify-between overflow-hidden shadow-2xl ${
            isCrashActive ? 'border-rose-900 ring-1 ring-rose-500/10' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2 font-mono text-[9px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="flex gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </span>
                <span className="ml-1 select-text">next_middle_telemetry.ts</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isCrashActive ? (
                  <span className="bg-rose-950 text-rose-400 font-bold px-1.5 py-0.5 rounded text-[8px] animate-pulse">INCIDENTS</span>
                ) : (
                  <span className="text-emerald-500 font-bold text-[8px] flex items-center gap-1">🟢 MONITOR</span>
                )}
              </div>
            </div>

            <div className="flex-1 font-mono text-[10px] leading-relaxed space-y-2 overflow-y-auto pr-1 select-text">
              {compilerLogs.map((log, idx) => {
                let col = "text-slate-400";
                if (log.includes("[STATUS]")) col = "text-blue-400";
                if (log.includes("[Success]")) col = "text-emerald-400 font-semibold";
                if (log.includes("[Compiler]")) col = "text-rose-400 bg-rose-950/30 p-1.5 rounded border border-rose-900/30 font-bold";
                if (log.includes(">>")) col = "text-rose-300 border-l-2 border-rose-500 pl-2";
                return (
                  <div key={idx} className={`${col} select-text text-left break-all`}>
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-900 pt-2.5 mt-2 flex items-center justify-between">
              {isCrashActive ? (
                <span className="text-[8.5px] text-slate-500 uppercase tracking-widest font-mono">Region Q1-A</span>
              ) : (
                <button 
                  onClick={toggleCrashCodeSim}
                  className="text-amber-500 hover:text-amber-400 text-[9px] font-mono flex items-center gap-1"
                >
                  <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '4s' }} /> Reset log crash
                </button>
              )}
              <span className="text-[10px] font-mono text-slate-500">IDE Console</span>
            </div>
          </div>

          {/* WINDOW 2: Traction metrics overview panel */}
          <div className="lg:col-span-4 bg-slate-950/95 rounded-2xl border border-slate-800 p-3.5 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2 font-mono text-[9px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <BarChart3 size={11} className="text-blue-500" />
                saas_traction_analytics
              </span>
              <span className="text-blue-500">Region Q1-B</span>
            </div>

            <div className="flex-1 space-y-2 select-text text-left">
              <p className="text-[10px] text-slate-500 font-sans">Corporate ARR and growth metrics representation for active sandbox:</p>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase tracking-widest block font-mono">Conversion</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">5.48%</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-xl">
                  <span className="text-[8.5px] text-slate-500 uppercase tracking-widest block font-mono">Node Users</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">1,842</span>
                </div>
              </div>

              {/* Graphical nodes */}
              <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-850/60 mt-2">
                <div className="flex items-center justify-between text-[8px] text-slate-500 tracking-wider uppercase font-mono mb-1.5">
                  <span>Forecast ARR</span>
                  <span className="text-blue-400 font-bold">$3.15M Target</span>
                </div>
                <div className="h-10 flex items-end gap-1 px-1">
                  <div className="w-full bg-slate-800 h-[30%] rounded-xs" />
                  <div className="w-full bg-slate-800 h-[45%] rounded-xs" />
                  <div className="w-full bg-slate-700 h-[60%] rounded-xs" />
                  <div className="w-full bg-blue-600 h-[85%] rounded-xs animate-pulse" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-2.5 flex items-center justify-between text-[9.5px] font-mono text-slate-500">
              <span>Connector: Node Online</span>
              <span>Metric trends</span>
            </div>
          </div>

          {/* WINDOW 3: Co-author standup threads */}
          <div className="lg:col-span-4 bg-slate-950/95 rounded-2xl border border-slate-800 p-3.5 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2 font-mono text-[9px] text-slate-500">
              <span className="flex items-center gap-1">
                <MessageSquare size={11} className="text-blue-500" />
                active_collaborator_feeds
              </span>
              <span className="text-slate-600">Standup Room</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-[10px] pr-1 leading-relaxed max-h-[140px] select-text scrollbar-thin text-left">
              {chatMessages.map((msg, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-850 p-2 rounded-lg">
                  <div className="flex items-center justify-between text-slate-300 font-bold text-[9px] mb-0.5">
                    <span>{msg.author}</span>
                    <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-slate-400 text-[9.5px] font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-900 flex gap-1 items-center bg-slate-950">
              <input 
                type="text" 
                placeholder="Post mock standup line..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && postSimulatedStandupChat()}
                className="flex-1 bg-slate-900 border border-slate-800 text-[10.5px] rounded px-2.5 py-1 font-sans text-slate-300 focus:outline-none focus:border-blue-500 text-left"
              />
              <button 
                onClick={postSimulatedStandupChat}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded p-1.5 transition-all text-xs active:scale-95 shrink-0"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>

          {/* WINDOW 4: Drop sandbox and whitepaper viewer */}
          <div className="lg:col-span-8 bg-slate-950/95 rounded-2xl border border-slate-800 p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
            {!uploadedImage ? (
              // Abstract state
              <div className="flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2.5 font-mono text-[9px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-bold text-slate-400">
                      <FileText size={11} className="text-blue-500" />
                      scientific_memorandum_alignment.pdf
                    </span>
                    <span>Abstract Section</span>
                  </div>
                  <div className="space-y-2 text-[10px] leading-relaxed text-slate-400 select-text font-sans">
                    <h5 className="font-bold text-slate-200 uppercase tracking-widest text-[8.5px] text-blue-400">Section 4 — Cognitive Pipeline Limits</h5>
                    <p>
                      &quot;The cognitive performance layer represents a major development boundary. Models must prefer standalone, lazy initialization sequences. Sync checks on storage units prevent telemetry loss.&quot;
                    </p>
                    <p className="text-slate-500 font-mono text-[9px]">
                      Keywords: Standalone, Local Persistence, Screen Capture
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-slate-900 flex items-center justify-between">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-bold font-sans text-[10px] py-1.5 px-3 rounded-lg border border-blue-500/15 flex items-center gap-1.5 transition-all"
                  >
                    <ImageIcon size={11} />
                    Upload screenshot instead!
                  </button>
                  <span className="text-[9px] font-mono text-slate-600">Page 1 of 4</span>
                </div>
              </div>
            ) : (
              // Upload sandbox view
              <div className="flex-1 flex flex-col justify-between text-left overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 font-mono text-[9px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Sparkles size={11} className="text-emerald-500" />
                    Custom Image Selection Bounds
                  </span>
                  <button onClick={() => setUploadedImage(null)} className="text-rose-400 hover:text-rose-300">
                    Clear image
                  </button>
                </div>

                <div 
                  ref={uploadContainerRef}
                  className="flex-1 relative bg-slate-950/80 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 border-dashed max-h-[160px] min-h-[130px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={uploadedImage} 
                    alt="Simulated screenshot canvas" 
                    className="max-h-[130px] max-w-full object-contain select-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 text-slate-400 text-[8px] py-1 text-center font-mono">
                    Press Alt+C & drag a selection box over this custom screenshot region!
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Gemini Vision extraction sandbox active</span>
                  <button onClick={() => fileInputRef.current?.click()} className="text-blue-400 underline font-semibold">
                    Change image file
                  </button>
                </div>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* WINDOW 5: System Pipeline Monitor */}
          <div className="lg:col-span-4 bg-[#08090d] text-slate-300 rounded-2xl border border-blue-900/15 p-3.5 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2 font-mono text-[9.5px] text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <Cpu size={11} className="text-blue-500" />
                cognitive_pipeline_metrics
              </span>
              <span className="text-[8px] text-blue-500 font-mono">Region Q2-C</span>
            </div>

            <div className="flex-1 space-y-2 text-left select-text font-sans">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Active Pipeline:</span>
                <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">gemini-3.5-flash-Vision</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 text-[9.5px] font-mono">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-850/60">
                  <span className="text-[7.5px] text-slate-500 block uppercase font-bold">OCR Delay</span>
                  <span className="text-slate-200 block font-semibold">124 ms</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-850/60 font-medium">
                  <span className="text-[7.5px] text-slate-500 block uppercase font-bold text-slate-500">Saves Sync Delay</span>
                  <span className="text-slate-200 block font-semibold">14 ms</span>
                </div>
              </div>

              {/* Cognitive Status Stream */}
              <div className="pt-1.5">
                <span className="text-[8.5px] text-slate-400 block font-mono uppercase tracking-widest mb-1 font-semibold">Parser Grounding Checks</span>
                <div className="space-y-1 font-mono text-[8.5px] text-slate-500 leading-normal">
                  <div className="flex items-center justify-between bg-slate-900/40 p-1 rounded">
                    <span>• Multimodal Vision Extraction</span>
                    <span className="text-emerald-400">READY</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/40 p-1 rounded">
                    <span>• Structured Schema Sync</span>
                    <span className="text-emerald-400">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/40 p-1 rounded">
                    <span>• Persistent Offline Indexer</span>
                    <span className="text-blue-400">STANDBY</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-2.5 flex items-center justify-between text-[9.5px] font-mono text-slate-500">
              <span className="text-slate-600">Cognitive Pipeline</span>
              <span>100% Operational</span>
            </div>
          </div>

          {/* SIMULATED DESKTOP SELECTION CRITICAL OVERLAY */}
          <AnimatePresence>
            {isCapturing && (
              <div className="absolute inset-0 bg-transparent touch-none pointer-events-none select-none z-10" />
            )}
          </AnimatePresence>

          {/* Selection cropping frame drawing preview */}
          {isCapturing && dragActive && (
            <div 
              className="absolute border border-blue-500 bg-transparent z-20 pointer-events-none"
              style={{
                left: Math.min(captureStartPos.x, captureCurrentPos.x),
                top: Math.min(captureStartPos.y, captureCurrentPos.y),
                width: Math.abs(captureCurrentPos.x - captureStartPos.x),
                height: Math.abs(captureCurrentPos.y - captureStartPos.y)
              }}
            />
          )}

          {/* SIMULATED RIGHT CLICK CONTEXT MENU */}
          <AnimatePresence>
            {contextMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-1 shadow-2xl z-40 w-52 font-sans text-xs text-left"
                style={{ left: contextMenu.x, top: contextMenu.y }}
              >
                <div className="px-3 py-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-850 select-none">
                  CaptureFlow Options
                </div>
                {selectedText && (
                  <button
                    onClick={() => handleContextCapture(selectedText, true)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-850 rounded-lg flex items-center gap-2 text-emerald-400 font-semibold"
                  >
                    <Check size={12} className="text-emerald-400" />
                    ✨ Capture Selected Text
                  </button>
                )}
                <button
                  onClick={() => {
                    const fullContext = `
SYSTEM COMPILER LOGS:
${compilerLogs.join("\n")}

ACTIVE CHAT RUNTIME DISCUSSION:
${chatMessages.map(m => `${m.author}: ${m.text}`).join("\n")}

SALES CONVERSION METRICS ENGINE:
- Conversion rate: 5.48%
- Active concurrent node users: 1,842
- ARR Indicator targets: $3.15M

WHITEPAPER ARCHITECTURAL ALIGNMENT ABSTRACT:
The cognitive performance layer represents a major development boundary. Models must prefer standalone, lazy initialization sequences. Sync checks on storage units prevent telemetry loss.
                    `.trim();
                    handleContextCapture(fullContext, false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-850 rounded-lg flex items-center gap-2 text-slate-200 font-semibold"
                >
                  <Crop size={12} className="text-blue-400" />
                  📸 Capture Screen (All Text)
                </button>
                <button
                  onClick={() => { setIsDbOpen(true); setContextMenu(null); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-850 rounded-lg flex items-center gap-2 text-slate-300 font-semibold"
                >
                  <Database size={12} className="text-emerald-400" />
                  📂 Open Retrieval Vault
                </button>
                {isCrashActive && (
                  <button
                    onClick={() => { setIsCrashActive(false); setContextMenu(null); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-850 rounded-lg flex items-center gap-2 text-slate-400"
                  >
                    <Check size={12} className="text-blue-500" />
                    Apply AI hotfix directly
                  </button>
                )}
                <div className="border-t border-slate-850 my-1 pb-1" />
                <button
                  onClick={() => { setArtifacts(INITIAL_ARTIFACTS); triggerSystemAlert("Database reset completed.", "info"); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-950/40 text-rose-400 rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={11} />
                  Clear Captured Files
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INTEGRATED POPUP SEARCH VAULT MODAL (Only populates if requested by user) */}
          <AnimatePresence>
            {isDbOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="absolute inset-x-4 inset-y-4 bg-[#0a0c12]/98 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl flex flex-col z-30 overflow-hidden"
              >
                {/* Titlebar header */}
                <div className="bg-slate-900 border-b border-slate-850 px-4 py-2 flex items-center justify-between text-xs text-slate-300 font-mono shrink-0 select-text">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-1 shrink-0">
                      <button onClick={() => setIsDbOpen(false)} className="w-2.5 h-2.5 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-slate-400 ml-1">captureflow_retrieval_vault_feed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-bold uppercase text-[9px] tracking-wide">database online</span>
                    <button onClick={() => setIsDbOpen(false)} className="text-slate-400 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                  
                  {/* Left Column: Search input and captures stream */}
                  <div className="lg:col-span-5 border-r border-[#151c2e] flex flex-col overflow-hidden p-4">
                    <div className="space-y-3 shrink-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Spotlight Search</span>
                        <span className="text-[10px] font-mono text-slate-500">{matchFuzzyQuery.length} items logged</span>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                          <Search size={13} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Fuzzy search titles, platforms, speakers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 text-xs rounded-xl pl-9 pr-8 py-2 text-slate-300 focus:outline-none focus:border-blue-500 text-left"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2 text-slate-500 hover:text-slate-300">
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {/* Pill scroll filters */}
                      <div className="flex flex-wrap gap-1 pb-1">
                        {[
                          { id: "all", label: "All captures" },
                          { id: "code_snippet", label: "Code" },
                          { id: "action_items", label: "Checklists" },
                          { id: "data_insights", label: "Metrics" },
                          { id: "general_knowledge", label: "System Notes" }
                        ].map(pill => (
                          <button
                            key={pill.id}
                            onClick={() => setSelectedTypeFilter(pill.id)}
                            className={`text-[9.5px] font-sans px-2.5 py-1 rounded-md border transition-colors ${
                              selectedTypeFilter === pill.id 
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-850"
                            }`}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                       {/* Management Operations Panel */}
                      <div className="flex gap-1.5 items-center justify-between text-xs py-1.5 px-2 bg-[#0d1220] rounded-xl border border-slate-850">
                        <button
                          onClick={() => {
                            setIsSelectMode(!isSelectMode);
                            setSelectedArtifactIds([]);
                          }}
                          className={`text-[9px] font-mono px-2 py-1 rounded border transition-all flex items-center gap-1 font-semibold shrink-0 ${
                            isSelectMode 
                              ? "bg-rose-950/20 text-rose-400 border-rose-500/30" 
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-850"
                          }`}
                        >
                          <Layers size={9} />
                          {isSelectMode ? "Cancel Select" : "Select & Erase"}
                        </button>

                        <button
                          onClick={runAutomatedSynthesis}
                          disabled={isAutoSynthesizing}
                          className="text-[9px] font-mono px-2.5 py-1 bg-blue-950/40 border border-blue-900/40 hover:border-blue-500/30 text-blue-300 rounded transition-all flex items-center gap-1 shrink-0 font-bold"
                        >
                          {isAutoSynthesizing ? (
                            <RefreshCw size={9} className="animate-spin text-blue-400" />
                          ) : (
                            <Sparkles size={9} />
                          )}
                          {isAutoSynthesizing ? "Synthesizing..." : "Gemini Auto-Synthesize"}
                        </button>
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId("clear-all"); }}
                          className="text-[9px] font-mono px-2 py-1 bg-rose-950/25 border border-rose-950/60 hover:border-rose-500/30 hover:bg-rose-950/50 text-rose-400 rounded transition-all flex items-center gap-1 shrink-0"
                        >
                          <Trash2 size={9} />
                          Purge All
                        </button>
                      </div>
                    </div>

                     {/* select deletion inline active status bar */}
                     {isSelectMode && (
                       <div className="bg-gradient-to-r from-rose-950/25 to-slate-950/45 border border-rose-500/25 p-2.5 rounded-xl flex flex-col gap-1.5 shrink-0 mt-3 text-left animate-in fade-in slide-in-from-top-1 duration-200">
                         <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1">
                             <Trash2 size={10} className="text-rose-400" />
                             Erase Selected Segments
                           </span>
                           <span className="text-[9px] font-mono text-slate-500 flex items-center">Selection style</span>
                         </div>
                         <p className="text-[9.5px] text-slate-400 leading-normal">
                           Select individual knowledge artifacts you wish to erase from your CaptureFlow retrieval vault.
                         </p>
                         <div className="flex gap-1.5 mt-1">
                           <button
                             onClick={() => setDeleteConfirmId("clear-selected")}
                             disabled={selectedArtifactIds.length === 0}
                             className={`flex-1 font-sans text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                               selectedArtifactIds.length > 0
                                 ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer"
                                 : "bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed"
                             }`}
                           >
                             <Trash2 size={10} />
                             Confirm Erase ({selectedArtifactIds.length})
                           </button>
                           <button
                             onClick={() => {
                               setIsSelectMode(false);
                               setSelectedArtifactIds([]);
                             }}
                             className="bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-lg font-semibold"
                           >
                             Cancel
                           </button>
                         </div>
                       </div>
                     )}

                    {/* Stream Scrollable area */}
                    <div className="flex-1 overflow-y-auto mt-3.5 space-y-2.5 pr-1 scrollbar-thin text-left">
                      {matchFuzzyQuery.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-[11px] font-sans space-y-2">
                          <AlertCircle size={16} className="mx-auto text-slate-600" />
                          <p>No captured screen segments found matching search query.</p>
                        </div>
                      ) : (
                        matchFuzzyQuery.map(art => {
                          const isActive = art.id === activeArtifactId;
                          const isSelected = selectedArtifactIds.includes(art.id);
                          return (
                            <div
                              key={art.id}
                              onClick={() => {
                                if (isSelectMode) {
                                  toggleSelectArtifact(art.id);
                                } else {
                                  setActiveArtifactId(art.id);
                                }
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                                isSelectMode
                                  ? isSelected 
                                    ? "bg-blue-600/10 border-blue-500/80 shadow-md ring-1 ring-blue-500/45" 
                                    : "bg-slate-950/40 border-slate-850 hover:border-slate-800 opacity-80"
                                  : isActive 
                                    ? "bg-slate-900 border-blue-500 shadow-lg" 
                                    : "bg-slate-950/40 border-slate-850 hover:border-slate-800 hover:bg-slate-900/45"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  {isSelectMode && (
                                    <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                                      isSelected ? "bg-blue-600 border-blue-500 text-white" : "border-slate-700 bg-slate-950"
                                    }`}>
                                      {isSelected && <Check size={9} strokeWidth={3.5} />}
                                    </div>
                                  )}
                                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border ${getBadgeColors(art.type)}`}>
                                    {art.type.replace("_", " ").toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); downloadPayloadJSON(art); }}
                                    className="p-1 hover:text-slate-200 text-slate-500 rounded bg-slate-900 border border-transparent"
                                    title="Export raw payload"
                                  >
                                    <Download size={10} />
                                  </button>
                                  <button 
                                    onClick={(e) => initiateDiscardArtifact(art.id, e)}
                                    className="p-1 hover:text-rose-400 text-slate-500 rounded bg-slate-900 border border-transparent"
                                    title="Discard capture"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                              <h5 className="font-bold text-slate-200 text-[11.5px] line-clamp-1 mb-0.5">{art.title}</h5>
                              <p className="text-slate-400 text-[10px] font-sans line-clamp-2 leading-relaxed mb-2">
                                {art.content.replace(/##|###|`|\[ |\]/g, "")}
                              </p>
                              <div className="flex items-center justify-between border-t border-slate-900 pt-1.5 text-[8px] font-mono text-slate-500">
                                <span className="line-clamp-1">App: {art.sourceApp}</span>
                                <span>{new Date(art.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Deep Markdown visualization and checklist targets */}
                  <div className="lg:col-span-7 flex flex-col overflow-y-auto p-4 space-y-4">
                    {/* Vault Interior Navigation Tab buttons */}
                    <div className="flex bg-slate-920 p-1 rounded-xl border border-slate-800 self-start shrink-0">
                      <button
                        onClick={() => setVaultTab("insight")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-2 ${
                          vaultTab === "insight"
                            ? "bg-blue-600 text-white shadow-md font-bold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Layers size={12} />
                        Captured Insight
                      </button>
                      <button
                        onClick={() => setVaultTab("checklist")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-2 ${
                          vaultTab === "checklist"
                            ? "bg-blue-600 text-white shadow-md font-bold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <CheckSquare size={12} />
                        Action Checklist
                        {tasks.filter(t => !t.completed).length > 0 && (
                          <span className="bg-slate-950 text-blue-400 text-[10px] px-1.5 rounded-full font-mono font-bold">
                            {tasks.filter(t => !t.completed).length}
                          </span>
                        )}
                      </button>
                    </div>

                    {vaultTab === "insight" ? (
                      activeArtifact ? (
                        <div className="space-y-4 text-left select-text">
                          
                          {/* Summary metadata header block */}
                          <div className="border-b border-slate-850 pb-3 block">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">ACTIVE CAPTURED ARTIFACT RAW DETAIL</span>
                            <h4 className="text-sm font-bold text-slate-100 font-display mt-0.5">{activeArtifact.title}</h4>
                          </div>

                          {/* Top cognitive learnings takeaways */}
                          <div className="bg-blue-500/5 border border-blue-500/25 rounded-xl p-3">
                            <span className="text-[8.5px] font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1.5">Synthesized learnings Takeaways</span>
                            <ul className="space-y-1">
                              {activeArtifact.keyTakeaways.map((taskItem, idx) => (
                                <li key={idx} className="text-[10.5px] text-slate-300 leading-relaxed font-sans flex items-start gap-1.5">
                                  <span className="text-blue-500 font-bold">•</span>
                                  <span>{taskItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Detailed property checklist */}
                          <div className="grid grid-cols-2 gap-2 text-[9.5px] font-mono bg-slate-900/40 border border-slate-850 p-3 rounded-xl">
                            <div>
                              <span className="text-slate-500 block text-[7.5px] uppercase font-bold">Severity Weight</span>
                              <span className={`font-semibold ${activeArtifact.metadata.priority === 'High' ? 'text-rose-400' : 'text-slate-300'}`}>
                                {activeArtifact.metadata.priority}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[7.5px] uppercase font-bold">Extracted platforms</span>
                              <span className="text-slate-300 line-clamp-1">{activeArtifact.metadata.technologiesOrPlatforms}</span>
                            </div>
                            <div className="col-span-2 border-t border-slate-850/60 my-1 pt-1" />
                            <div>
                              <span className="text-slate-500 block text-[7.5px] uppercase font-bold">Stakeholders / Entities</span>
                              <span className="text-slate-300 line-clamp-1">{activeArtifact.metadata.actioneesOrSpeakers}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[7.5px] uppercase font-bold">Timeframe contextual</span>
                              <span className="text-slate-300 line-clamp-1">{activeArtifact.metadata.timeContext}</span>
                            </div>
                          </div>

                          {/* Actual Markdown preview box */}
                          <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-3.5 max-h-[220px] overflow-y-auto font-sans text-xs">
                            {displayStructuredText(activeArtifact.content)}
                          </div>

                          {/* Action controllers */}
                          <div className="flex gap-2 shrink-0 border-t border-slate-850/60 pt-3">
                            <button
                              onClick={() => fillFollowupsFromArtifact(activeArtifact)}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10.5px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all outline-none"
                            >
                              <CheckSquare size={12} />
                              Compile Action items
                            </button>
                            <button
                              onClick={() => handleCopyToClipboard(activeArtifact.content, activeArtifact.id)}
                              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-[10.5px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <Copy size={11} />
                              {copiedId === activeArtifact.id ? "Copied" : "Copy Md representation"}
                            </button>
                          </div>

                        </div>
                      ) : (
                        <div className="py-24 text-center text-slate-500 text-[11px]">
                          Select any captured index item on the left to view the cognitive summary block.
                        </div>
                      )
                    ) : (
                      /* RENDER CHECKLIST INSIDE RETRIEVAL VAULT ONLY */
                      <div className="flex flex-col h-full space-y-4">
                        <div className="border-b border-slate-850 pb-3 block text-left">
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Interactive Todo Board</span>
                          <h4 className="text-sm font-bold text-slate-100 font-display mt-0.5">CaptureFlow Cognitive Action checklist</h4>
                        </div>

                        <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[240px]">
                          {tasks.length === 0 ? (
                            <p className="text-[10px] text-slate-500 py-12 text-center select-none">
                              Checklist currently clear of goals. Compile action items inside any captured insight to populate this.
                            </p>
                          ) : (
                            tasks.map(t => (
                              <div
                                key={t.id}
                                onClick={() => toggleTaskState(t.id)}
                                className="flex items-start gap-2.5 bg-slate-900/40 border border-slate-850 p-2.5 rounded-lg cursor-pointer hover:bg-slate-900/80 transition-colors text-left"
                              >
                                <span className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border-2 transition-colors shrink-0 ${
                                  t.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-700"
                                }`}>
                                  {t.completed && <Check size={8} strokeWidth={3.5} />}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[10.5px] font-semibold leading-normal break-all ${t.completed ? "line-through text-slate-550 mr-1.5" : "text-slate-200"}`}>
                                    {t.text}
                                  </p>
                                  {t.sourceArtifactTitle && (
                                    <span className="text-[8px] font-mono text-slate-500 block mt-0.5 truncate">
                                      Source: {t.sourceArtifactTitle}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget.elements.namedItem("taskField") as HTMLInputElement;
                            if (input.value.trim()) {
                              addManualTask(input.value);
                              input.value = "";
                            }
                          }}
                          className="mt-3 flex gap-2 shrink-0 animate-fade-in"
                        >
                          <input 
                            type="text" 
                            name="taskField"
                            placeholder="Register manual action context item..."
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-sans text-slate-300 focus:outline-none focus:border-blue-500 text-left"
                          />
                          <button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all"
                          >
                            Add Target
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                </div>

                {/* Delete / Clear Confirmation Overlay Box */}
                {deleteConfirmId && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#0e111a] border border-slate-800 p-5 rounded-2xl max-w-sm w-full shadow-2xl space-y-4 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                        <AlertCircle size={22} />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-200">
                          {deleteConfirmId === "clear-all" 
                            ? "Purge Entire Retrieval Vault?" 
                            : deleteConfirmId === "clear-selected" 
                              ? `Purge Selected ${selectedArtifactIds.length} Segments?`
                              : "Delete Retrieval Segment?"}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {deleteConfirmId === "clear-all" 
                            ? "This will wipe all captured screen segments from your local database store permanently. This action cannot be undone." 
                            : deleteConfirmId === "clear-selected"
                              ? `Are you sure you want to permanently erase the ${selectedArtifactIds.length} chosen segments from your retrieval feed? This action is permanent.`
                              : "Are you sure you want to delete this segment from your retrieval feed? This action is permanent."}
                        </p>
                      </div>

                      <div className="flex gap-2.5 pt-1">
                        <button
                          onClick={confirmDiscardArtifact}
                          className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-sans text-xs font-bold py-2 px-4 rounded-xl shadow-lg transition-colors cursor-pointer"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-sans text-xs font-semibold py-2 px-4 rounded-xl border border-slate-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Ambient Footer */}
      <footer className="mt-auto border-t border-slate-900/60 bg-slate-950/40 px-6 py-3.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>CF-v0.9.0 Cognitive Workspace Layer Running Silently</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Platform: Dev Sandboxed Simulated Environment</span>
          <span>|</span>
          <span>2026-05-29 UTC Console</span>
        </div>
      </footer>

    </div>
  );
}
