export type Verdict = "fake" | "real" | "misleading";

export interface AnalysisResult {
  id: string;
  text: string;
  verdict: Verdict;
  confidence: number; // 0-100
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number; // -1 to 1
  keywords: string[];
  explanation: string;
  createdAt: number;
}

const FAKE_SIGNALS = [
  "shocking", "you won't believe", "secret", "hoax", "miracle", "exposed",
  "conspiracy", "they don't want", "bombshell", "shocking truth", "alien",
  "cure", "instantly", "doctors hate", "leaked", "banned",
];
const REAL_SIGNALS = [
  "according to", "reported", "study", "researchers", "official",
  "announced", "spokesperson", "data shows", "published in", "reuters",
  "associated press", "ministry", "university",
];
const MISLEADING_SIGNALS = [
  "claims", "allegedly", "some say", "rumored", "viral", "unverified",
  "sources suggest", "may have", "could be",
];

const NEG_WORDS = ["crisis", "disaster", "war", "death", "fail", "scam", "fraud", "attack", "danger"];
const POS_WORDS = ["win", "success", "growth", "breakthrough", "hope", "praised", "approved", "record"];

const STOPWORDS = new Set("the a an and or but is are was were be been being of in on to for with by at from as it this that these those i you he she we they his her its their our your".split(" "));

function score(text: string, signals: string[]) {
  const lower = text.toLowerCase();
  return signals.reduce((acc, s) => acc + (lower.includes(s) ? 1 : 0), 0);
}

function extractKeywords(text: string, n = 6): string[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const freq = new Map<string, number>();
  for (const w of words) {
    if (w.length < 4 || STOPWORDS.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  // Simulated AI latency
  await new Promise((r) => setTimeout(r, 1400 + Math.random() * 700));

  const fake = score(text, FAKE_SIGNALS);
  const real = score(text, REAL_SIGNALS);
  const mis = score(text, MISLEADING_SIGNALS);

  let verdict: Verdict;
  let confidence: number;
  if (fake > real && fake >= mis) {
    verdict = "fake";
    confidence = Math.min(96, 62 + fake * 7 + Math.random() * 8);
  } else if (real > fake && real >= mis) {
    verdict = "real";
    confidence = Math.min(97, 65 + real * 6 + Math.random() * 8);
  } else if (mis > 0) {
    verdict = "misleading";
    confidence = Math.min(90, 55 + mis * 6 + Math.random() * 10);
  } else {
    // Heuristic fallback
    const exclam = (text.match(/!/g) || []).length;
    const caps = (text.match(/\b[A-Z]{4,}\b/g) || []).length;
    if (exclam + caps >= 2) {
      verdict = "misleading";
      confidence = 60 + Math.random() * 15;
    } else {
      verdict = text.length > 80 ? "real" : "misleading";
      confidence = 55 + Math.random() * 20;
    }
  }

  const lower = text.toLowerCase();
  const neg = NEG_WORDS.reduce((a, w) => a + (lower.includes(w) ? 1 : 0), 0);
  const pos = POS_WORDS.reduce((a, w) => a + (lower.includes(w) ? 1 : 0), 0);
  const sentimentScore = (pos - neg) / Math.max(1, pos + neg + 1);
  const sentiment: AnalysisResult["sentiment"] =
    sentimentScore > 0.15 ? "positive" : sentimentScore < -0.15 ? "negative" : "neutral";

  const explanations: Record<Verdict, string> = {
    fake: "This article contains sensational language, emotional triggers, and patterns commonly associated with misinformation.",
    real: "Language patterns, attribution of sources, and tone are consistent with verified journalistic content.",
    misleading: "The article uses ambiguous claims and unverified language. Cross-check with trusted sources before sharing.",
  };

  return {
    id: crypto.randomUUID(),
    text,
    verdict,
    confidence: Math.round(confidence),
    sentiment,
    sentimentScore: Number(sentimentScore.toFixed(2)),
    keywords: extractKeywords(text),
    explanation: explanations[verdict],
    createdAt: Date.now(),
  };
}

export const SAMPLE_ARTICLES = [
  "BREAKING: Scientists discover SHOCKING miracle cure that doctors don't want you to know about! Click here!",
  "According to a study published by Stanford University researchers, renewable energy adoption rose 18% last year.",
  "Sources allegedly suggest the prime minister may have secretly met with foreign agents — unverified rumors are going viral.",
  "The Ministry of Health announced new vaccination guidelines following data from a peer-reviewed clinical trial.",
];
