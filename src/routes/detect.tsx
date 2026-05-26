import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeText, SAMPLE_ARTICLES, type AnalysisResult } from "@/lib/mockAi";
import { saveResult, getHistory } from "@/lib/history";
import {
  AlertTriangle, CheckCircle2, XCircle, Loader2, Image as ImageIcon, Mic, Share2, Sparkles, Trash2, History,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";


export const Route = createFileRoute("/detect")({
  head: () => ({
    meta: [
      { title: "Detect — TruthLens AI" },
      { name: "description", content: "Paste a headline or article and let TruthLens AI classify it as real, fake, or misleading." },
    ],
  }),
  component: DetectPage,
});

const VERDICT_META = {
  fake: { label: "Fake News", color: "var(--danger)", icon: XCircle },
  real: { label: "Real News", color: "var(--success)", icon: CheckCircle2 },
  misleading: { label: "Possibly Misleading", color: "var(--warning)", icon: AlertTriangle },
} as const;

function DetectPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setHistory(getHistory());
    const sync = () => setHistory(getHistory());
    window.addEventListener("truthlens-history", sync);
    return () => window.removeEventListener("truthlens-history", sync);
  }, []);

  const analyze = async () => {
    if (!text.trim() || text.trim().length < 10) {
      toast.error("Please enter at least 10 characters");
      return;
    }
    setLoading(true);
    setResult(null);
    const input = text.trim();
    try {
      const r = await analyzeText(input);
      setResult(r);
      saveResult(r);
    } finally {
      setLoading(false);
    }

  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    setText(`[Image upload] Headline extracted: ${name}`);
    toast.success("Image uploaded — caption extracted (demo)");
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => setText((p) => (p ? p + " " : "") + e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const share = async () => {
    if (!result) return;
    const text = `TruthLens AI verdict: ${VERDICT_META[result.verdict].label} (${result.confidence}% confidence)`;
    try {
      if (navigator.share) await navigator.share({ title: "TruthLens AI", text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Result copied to clipboard");
      }
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Toaster richColors position="top-center" />

      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-4">
          <Sparkles className="size-3 text-[color:var(--neon)]" /> AI Detector
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Fact-check <span className="text-gradient">any article</span>
        </h1>
        <p className="text-muted-foreground mt-3">Paste, upload, or speak a news headline to analyze.</p>
      </div>

      {/* Input card */}
      <div className="glass p-6 sm:p-8 animate-slide-up">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a news headline or full article here..."
          className="min-h-[180px] text-base bg-[color:var(--input)] border-border resize-none focus-visible:ring-[color:var(--neon)]"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
            <Button variant="neon" size="sm" onClick={() => fileRef.current?.click()}>
              <ImageIcon /> Upload
            </Button>
            <Button
              variant="neon"
              size="sm"
              onClick={startVoice}
              disabled={listening}
              className={listening ? "animate-pulse-glow" : ""}
            >
              <Mic /> {listening ? "Listening…" : "Voice"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setText("")}>
              <Trash2 /> Clear
            </Button>
          </div>
          <Button variant="hero" size="lg" onClick={analyze} disabled={loading} className="min-w-[140px]">
            {loading ? (<><Loader2 className="animate-spin" /> Analyzing…</>) : "Analyze"}
          </Button>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Try a sample:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_ARTICLES.map((s, i) => (
              <button
                key={i}
                onClick={() => setText(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-[color:color-mix(in_oklab,var(--neon)_18%,transparent)] transition-colors text-left max-w-xs truncate"
                title={s}
              >
                {s.slice(0, 40)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="glass p-8 mt-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-[color:var(--neon)]" />
            <p className="font-medium">AI is analyzing language patterns…</p>
          </div>
          <div className="mt-4 h-2 rounded-full overflow-hidden bg-secondary">
            <div className="h-full w-1/2 bg-[image:var(--gradient-hero)] animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && <ResultCard result={result} onShare={share} />}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="size-5 text-[color:var(--neon)]" /> Recent checks
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {history.slice(0, 6).map((h) => {
              const meta = VERDICT_META[h.verdict];
              const Icon = meta.icon;
              const colorVar = h.verdict === "fake" ? "--danger" : h.verdict === "real" ? "--success" : "--warning";
              return (
                <button
                  key={h.id}
                  onClick={() => { setResult(h); setText(h.text); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="glass p-4 text-left hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm line-clamp-2 flex-1">{h.text}</p>
                    <Icon className="size-5 shrink-0" style={{ color: `var(${colorVar})` }} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{meta.label}</span>
                    <span>{h.confidence}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, onShare }: { result: AnalysisResult; onShare: () => void }) {
  const meta = VERDICT_META[result.verdict];
  const Icon = meta.icon;
  const colorVar = result.verdict === "fake" ? "--danger" : result.verdict === "real" ? "--success" : "--warning";

  return (
    <div className="mt-6 glass p-6 sm:p-8 animate-slide-up neon-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="size-16 rounded-2xl flex items-center justify-center"
            style={{ background: `color-mix(in oklab, var(${colorVar}) 25%, transparent)` }}
          >
            <Icon className="size-8" style={{ color: `var(${colorVar})` }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Verdict</p>
            <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: `var(${colorVar})` }}>{meta.label}</h3>
          </div>
        </div>
        <Button variant="neon" onClick={onShare}><Share2 /> Share result</Button>
      </div>

      {/* Confidence bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-bold" style={{ color: `var(${colorVar})` }}>{result.confidence}%</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${result.confidence}%`, background: `linear-gradient(90deg, var(--neon), var(${colorVar}))` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl p-4 bg-[color:color-mix(in_oklab,var(--neon)_8%,transparent)]">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Sentiment</p>
          <p className="text-lg font-semibold mt-1 capitalize">{result.sentiment}</p>
          <p className="text-xs text-muted-foreground mt-1">Score: {result.sentimentScore}</p>
        </div>
        <div className="rounded-xl p-4 bg-[color:color-mix(in_oklab,var(--cyber)_8%,transparent)]">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Keywords detected</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {result.keywords.length === 0 && <span className="text-sm text-muted-foreground">None significant</span>}
            {result.keywords.map((k) => (
              <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-[color:color-mix(in_oklab,var(--cyber)_22%,transparent)]">
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 rounded-xl border border-border bg-[color:color-mix(in_oklab,var(--card)_60%,transparent)]">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">AI explanation: </span>
          {result.explanation}
        </p>
      </div>
    </div>
  );
}
