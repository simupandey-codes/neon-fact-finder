import { createServerFn } from "@tanstack/react-start";

export type Verdict = "fake" | "real" | "misleading";

export interface AnalysisPayload {
  verdict: Verdict;
  confidence: number;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  keywords: string[];
  explanation: string;
}

const SYSTEM = `You are TruthLens AI, a fact-checking classifier. Analyze the given news text and return ONLY valid JSON (no markdown, no prose) with this exact shape:
{
  "verdict": "fake" | "real" | "misleading",
  "confidence": number (0-100),
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": number (-1 to 1, 2 decimals),
  "keywords": string[] (3-6 key terms),
  "explanation": string (1-2 sentences explaining the verdict)
}
Use "fake" for likely fabricated/sensational misinformation, "real" for content consistent with verified reporting, "misleading" for unverified/ambiguous claims.`;

export const analyzeWithAI = createServerFn({ method: "POST" })
  .inputValidator((data: { text: string }) => {
    if (!data?.text || typeof data.text !== "string") throw new Error("text required");
    if (data.text.length > 8000) throw new Error("text too long");
    return { text: data.text };
  })
  .handler(async ({ data }): Promise<AnalysisPayload> => {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error("OPENROUTER_API_KEY not configured");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://truthlens.lovable.app",
        "X-Title": "TruthLens AI",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4-fast:free",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.text },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("OpenRouter error", res.status, t);
      throw new Error(`AI request failed (${res.status})`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned invalid JSON");
      parsed = JSON.parse(m[0]);
    }

    const verdict: Verdict =
      parsed.verdict === "fake" || parsed.verdict === "real" || parsed.verdict === "misleading"
        ? parsed.verdict
        : "misleading";

    return {
      verdict,
      confidence: Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 70))),
      sentiment: ["positive", "neutral", "negative"].includes(parsed.sentiment) ? parsed.sentiment : "neutral",
      sentimentScore: Number(Number(parsed.sentimentScore ?? 0).toFixed(2)),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 6).map(String) : [],
      explanation: String(parsed.explanation || "Analysis complete."),
    };
  });
