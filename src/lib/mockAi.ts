export type Verdict = "fake" | "real" | "misleading";

export interface AnalysisResult {
  id: string;
  text: string;
  verdict: Verdict;
  confidence: number; // 0-100
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number; // -1 to 1
  keywords: string[];
  suspiciousKeywords: string[];
  explanation: string;
  signals: {
    sensational: string[];
    clickbait: string[];
    conspiracy: string[];
    emotional: string[];
    unrealistic: string[];
    credible: string[];
    exclamations: number;
    allCaps: number;
  };
  createdAt: number;
}

// ===== Lexicons =====
const SENSATIONAL = [
  "shocking", "shocked", "unbelievable", "insane", "mind-blowing", "mindblowing",
  "jaw-dropping", "outrageous", "explosive", "bombshell", "devastating",
  "stunning", "horrifying", "terrifying", "epic", "destroys", "obliterates",
  "annihilates", "slams", "blasts", "savage",
];

const CLICKBAIT = [
  "you won't believe", "you wont believe", "what happened next", "this one trick",
  "doctors hate", "click here", "find out", "the reason will shock you",
  "number 7 will", "will blow your mind", "gone wrong", "must see", "must watch",
  "before it's deleted", "before its deleted", "they don't want you to know",
  "they dont want you to know", "wait till you see", "this is why",
];

const CONSPIRACY = [
  "conspiracy", "cover-up", "coverup", "cover up", "deep state", "illuminati",
  "new world order", "false flag", "chemtrails", "mind control", "they are hiding",
  "wake up sheeple", "do your research", "mainstream media won't", "msm won't",
  "globalist", "plandemic", "scamdemic", "5g causes", "microchip",
];

const EMOTIONAL = [
  "outraged", "furious", "disgusted", "heartbroken", "horrified", "terrified",
  "panic", "fear", "hate", "evil", "monster", "destroyed", "ruined", "betrayed",
  "scandal", "scandalous", "disgrace", "shameful",
];

const UNREALISTIC = [
  "miracle cure", "miracle", "instantly cures", "overnight", "secret formula",
  "100% guaranteed", "lose weight fast", "get rich quick", "anti-aging breakthrough",
  "ancient secret", "doctors don't want", "doctors dont want", "banned",
  "leaked footage", "exclusive leak", "aliens confirmed", "proven to cure cancer",
  "cures cancer", "reverses aging", "eternal youth",
];

const CREDIBLE = [
  "according to", "reported by", "study published", "peer-reviewed", "peer reviewed",
  "researchers found", "researchers at", "data shows", "official statement",
  "spokesperson said", "press release", "reuters", "associated press", "bbc",
  "the guardian", "new york times", "ministry of", "department of", "university of",
  "published in", "clinical trial", "journal of", "professor", "dr.",
];

const NEG_WORDS = ["crisis", "disaster", "war", "death", "fail", "scam", "fraud", "attack", "danger", "threat", "fear", "panic", "hate"];
const POS_WORDS = ["win", "success", "growth", "breakthrough", "hope", "praised", "approved", "record", "celebrate", "achievement"];

const STOPWORDS = new Set(
  "the a an and or but is are was were be been being of in on to for with by at from as it this that these those i you he she we they his her its their our your have has had will would could should may might can".split(" ")
);

// ===== Helpers =====
function findMatches(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const p of phrases) {
    if (lower.includes(p)) hits.push(p);
  }
  return hits;
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

function buildExplanation(
  verdict: Verdict,
  signals: AnalysisResult["signals"],
  suspicious: string[],
): string {
  const parts: string[] = [];

  if (verdict === "fake") {
    parts.push("This text shows strong patterns commonly associated with fake or fabricated news.");
  } else if (verdict === "misleading") {
    parts.push("This text contains ambiguous or unverified claims that warrant caution.");
  } else {
    parts.push("This text follows patterns typical of legitimate, verifiable reporting.");
  }

  const reasons: string[] = [];
  if (signals.sensational.length) reasons.push(`sensational language (e.g. "${signals.sensational[0]}")`);
  if (signals.clickbait.length) reasons.push(`clickbait phrasing (e.g. "${signals.clickbait[0]}")`);
  if (signals.conspiracy.length) reasons.push(`conspiracy terminology (e.g. "${signals.conspiracy[0]}")`);
  if (signals.emotional.length) reasons.push(`emotionally charged words (e.g. "${signals.emotional[0]}")`);
  if (signals.unrealistic.length) reasons.push(`unrealistic claims (e.g. "${signals.unrealistic[0]}")`);
  if (signals.exclamations >= 3) reasons.push(`excessive punctuation (${signals.exclamations} exclamation marks)`);
  if (signals.allCaps >= 2) reasons.push(`${signals.allCaps} ALL-CAPS words used for shouting`);
  if (signals.credible.length) reasons.push(`credible sourcing cues (e.g. "${signals.credible[0]}")`);

  if (reasons.length) {
    parts.push("Detected: " + reasons.slice(0, 4).join(", ") + ".");
  }

  if (verdict !== "real" && suspicious.length) {
    parts.push(`Suspicious keywords: ${suspicious.slice(0, 5).join(", ")}.`);
  }

  if (verdict !== "real") {
    parts.push("Always cross-check with trusted sources before sharing.");
  }

  return parts.join(" ");
}

// ===== Main analyzer (offline, rule-based) =====
export async function analyzeText(text: string): Promise<AnalysisResult> {
  // Simulated processing latency for nice UX
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  const sensational = findMatches(text, SENSATIONAL);
  const clickbait = findMatches(text, CLICKBAIT);
  const conspiracy = findMatches(text, CONSPIRACY);
  const emotional = findMatches(text, EMOTIONAL);
  const unrealistic = findMatches(text, UNREALISTIC);
  const credible = findMatches(text, CREDIBLE);

  const exclamations = (text.match(/!/g) || []).length;
  const questionMarks = (text.match(/\?\?+/g) || []).length;
  const allCapsMatches = text.match(/\b[A-Z]{4,}\b/g) || [];
  const allCaps = allCapsMatches.length;

  // Weighted scoring
  const fakeScore =
    sensational.length * 2 +
    clickbait.length * 3 +
    conspiracy.length * 3 +
    unrealistic.length * 3 +
    emotional.length * 1.2 +
    Math.min(exclamations, 6) * 1 +
    questionMarks * 1.5 +
    Math.min(allCaps, 5) * 1.2;

  const realScore = credible.length * 3 + (text.length > 200 ? 1.5 : 0);

  let verdict: Verdict;
  let baseConfidence: number;

  if (fakeScore >= 6 && fakeScore > realScore * 1.5) {
    verdict = "fake";
    baseConfidence = 70 + Math.min(25, fakeScore * 2);
  } else if (realScore >= 3 && realScore > fakeScore) {
    verdict = "real";
    baseConfidence = 70 + Math.min(25, realScore * 4);
  } else if (fakeScore >= 2) {
    verdict = "misleading";
    baseConfidence = 60 + Math.min(25, fakeScore * 3);
  } else if (realScore > 0) {
    verdict = "real";
    baseConfidence = 65 + Math.min(20, realScore * 5);
  } else {
    // No strong signals — neutral text
    verdict = "misleading";
    baseConfidence = 55 + Math.random() * 10;
  }

  const confidence = Math.max(50, Math.min(98, Math.round(baseConfidence)));

  // Sentiment
  const lower = text.toLowerCase();
  const neg = NEG_WORDS.reduce((a, w) => a + (lower.includes(w) ? 1 : 0), 0) + emotional.length * 0.5;
  const pos = POS_WORDS.reduce((a, w) => a + (lower.includes(w) ? 1 : 0), 0);
  const sentimentScore = (pos - neg) / Math.max(1, pos + neg + 1);
  const sentiment: AnalysisResult["sentiment"] =
    sentimentScore > 0.15 ? "positive" : sentimentScore < -0.15 ? "negative" : "neutral";

  // Suspicious keywords = union of all red-flag matches, plus shouting caps
  const suspiciousKeywords = Array.from(
    new Set([
      ...sensational,
      ...clickbait,
      ...conspiracy,
      ...unrealistic,
      ...emotional,
      ...allCapsMatches.map((w) => w.toLowerCase()),
    ])
  ).slice(0, 8);

  const signals = {
    sensational,
    clickbait,
    conspiracy,
    emotional,
    unrealistic,
    credible,
    exclamations,
    allCaps,
  };

  return {
    id: crypto.randomUUID(),
    text,
    verdict,
    confidence,
    sentiment,
    sentimentScore: Number(sentimentScore.toFixed(2)),
    keywords: extractKeywords(text),
    suspiciousKeywords,
    explanation: buildExplanation(verdict, signals, suspiciousKeywords),
    signals,
    createdAt: Date.now(),
  };
}

export const SAMPLE_ARTICLES = [
  "BREAKING: Scientists discover SHOCKING miracle cure that doctors don't want you to know about! Click here!!!",
  "According to a study published by Stanford University researchers, renewable energy adoption rose 18% last year.",
  "Wake up sheeple! The deep state is hiding the TRUTH about chemtrails — they don't want you to know!",
  "The Ministry of Health announced new vaccination guidelines following data from a peer-reviewed clinical trial.",
];
