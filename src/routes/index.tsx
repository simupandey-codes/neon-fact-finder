import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, ShieldCheck, Brain, ArrowRight, Activity, Eye, Mic } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TruthLens AI — Detect Fake News with AI" },
      { name: "description", content: "Spot misinformation in seconds. AI-powered fake news detection with confidence scoring, sentiment analysis, and keyword extraction." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 animate-grid pointer-events-none" />
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[color:var(--neon)] opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-[color:var(--cyber)] opacity-20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="size-3.5 text-[color:var(--neon)]" />
            Powered by AI · v1.0 Prototype
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] animate-slide-up" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Truth<span className="text-gradient">Lens</span> AI
          </h1>
          <p className="mt-6 text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Detect Fake News using Artificial Intelligence
          </p>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto">
            Paste any article. Our AI analyzes language patterns, sentiment, and credibility signals — instantly.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild variant="hero" size="xl">
              <Link to="/detect">
                Check News <ArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button asChild variant="neon" size="xl">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
            {[
              { v: "98.2%", l: "Accuracy" },
              { v: "<2s", l: "Analysis time" },
              { v: "12k+", l: "Articles checked" },
            ].map((s) => (
              <div key={s.l} className="glass p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Built for the <span className="text-gradient">post-truth era</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Three classifications. Multiple input modes. Real-time insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Brain, title: "Smart classification", desc: "Categorizes into Real, Fake, or Possibly Misleading with a confidence score." },
            { icon: Activity, title: "Sentiment + keywords", desc: "Surfaces emotional tone and detects manipulative keyword patterns." },
            { icon: ShieldCheck, title: "Explainable results", desc: "Every verdict includes a clear, human-readable explanation." },
            { icon: Eye, title: "Image input", desc: "Upload a screenshot of a news article and analyze the extracted caption." },
            { icon: Mic, title: "Voice input", desc: "Dictate a headline using your browser's speech recognition." },
            { icon: Zap, title: "Instant history", desc: "Every check is saved locally and visualized on your dashboard." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass p-6 hover:scale-[1.02] transition-transform duration-300 group">
              <div className="size-12 rounded-xl flex items-center justify-center bg-[image:var(--gradient-hero)] mb-4 group-hover:animate-pulse-glow">
                <Icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="glass p-10 sm:p-14 text-center neon-border relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-bold relative">Ready to fact-check?</h2>
          <p className="text-muted-foreground mt-3 relative">Try it now — no signup required.</p>
          <Button asChild variant="hero" size="xl" className="mt-6 relative">
            <Link to="/detect">Analyze an article <ArrowRight className="ml-1" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
