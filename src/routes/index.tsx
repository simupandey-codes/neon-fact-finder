import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Brain, ArrowRight, Activity, Eye, Mic, Zap } from "lucide-react";

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
      <section className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-xs font-medium mb-6">
            <ShieldCheck className="size-3.5" />
            AI-powered fact checking
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight text-foreground">
            TruthLens AI
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Detect fake news using artificial intelligence.
          </p>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Paste any article and get an instant credibility analysis with confidence scoring and a clear explanation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/detect">
                Check news <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto px-6 pb-16 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { v: "98.2%", l: "Accuracy" },
            { v: "<2s", l: "Analysis time" },
            { v: "12k+", l: "Articles checked" },
          ].map((s) => (
            <div key={s.l} className="card-soft p-4 sm:p-5 text-center">
              <div className="text-xl sm:text-2xl font-semibold text-foreground">{s.v}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Built for everyday readers
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Three classifications. Multiple input modes. Clear, real-time insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Smart classification", desc: "Categorizes articles as Real, Fake, or Possibly Misleading with a confidence score." },
            { icon: Activity, title: "Sentiment & keywords", desc: "Surfaces emotional tone and detects manipulative keyword patterns." },
            { icon: ShieldCheck, title: "Explainable results", desc: "Every verdict includes a short, human-readable explanation." },
            { icon: Eye, title: "Image input", desc: "Upload a screenshot of an article and analyze the extracted caption." },
            { icon: Mic, title: "Voice input", desc: "Dictate a headline using your browser's speech recognition." },
            { icon: Zap, title: "History dashboard", desc: "Every check is saved locally and visualized on your dashboard." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-soft p-6 hover:shadow-md transition-shadow">
              <div className="size-10 rounded-lg flex items-center justify-center bg-accent mb-4">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="card-soft p-10 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Ready to fact-check?</h2>
          <p className="text-muted-foreground mt-2">Try it now — no signup required.</p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/detect">Analyze an article <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
