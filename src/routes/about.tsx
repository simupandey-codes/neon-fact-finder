import { createFileRoute } from "@tanstack/react-router";
import { Brain, Database, Cpu, Sparkles, Github, Linkedin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TruthLens AI" },
      { name: "description", content: "Learn how TruthLens AI detects fake news, the team behind the project, and the technology stack." },
    ],
  }),
  component: About,
});

const TEAM = [
  { name: "Aarav Sharma", role: "Frontend & UI", initials: "AS" },
  { name: "Priya Verma", role: "AI / ML Lead", initials: "PV" },
  { name: "Rohan Iyer", role: "Backend Engineer", initials: "RI" },
  { name: "Sneha Patel", role: "Research & Dataset", initials: "SP" },
];

const STEPS = [
  { icon: Database, title: "1. Ingest", desc: "We accept text, image captions, or voice transcripts as input." },
  { icon: Cpu, title: "2. Pre-process", desc: "Clean, tokenize, and extract linguistic features from the article." },
  { icon: Brain, title: "3. Classify", desc: "Run an NLP model (HuggingFace / OpenAI) to predict Real, Fake, or Misleading." },
  { icon: Sparkles, title: "4. Explain", desc: "Surface confidence, sentiment, keywords, and a human-readable explanation." },
];

function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* About project */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-4">
          <Sparkles className="size-3 text-[color:var(--neon)]" /> About the project
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Fighting misinformation with <span className="text-gradient">AI</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl mx-auto leading-relaxed">
          TruthLens AI is a 1st-year engineering student prototype that demonstrates how natural language
          processing can flag misleading or fabricated news articles in real time. The goal: help readers
          pause, verify, and think critically before sharing.
        </p>
      </section>

      {/* How AI detects fake news */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          How <span className="text-gradient">AI detects</span> fake news
        </h2>
        <p className="text-muted-foreground text-center mb-8">A 4-step pipeline running entirely in the browser for this prototype.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass p-5">
              <div className="size-11 rounded-xl flex items-center justify-center bg-[image:var(--gradient-hero)] mb-3">
                <Icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="glass p-6 sm:p-8 mb-16">
        <h2 className="text-xl font-bold mb-4">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {["React 19", "TanStack Start", "Tailwind CSS v4", "Recharts", "HuggingFace (planned)", "OpenAI API (optional)", "Python Flask (planned)"].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-xs bg-[color:color-mix(in_oklab,var(--neon)_15%,transparent)] border border-[color:color-mix(in_oklab,var(--neon)_30%,transparent)]">
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Note: this prototype currently uses a local mock model. The architecture is ready to swap in a real
          AI inference endpoint behind the same interface.
        </p>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Team <span className="text-gradient">members</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((m) => (
            <div key={m.name} className="glass p-6 text-center hover:scale-[1.03] transition-transform">
              <div className="mx-auto size-20 rounded-full flex items-center justify-center text-2xl font-bold bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-neon)]">
                {m.initials}
              </div>
              <h3 className="font-semibold mt-4">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
              <div className="flex justify-center gap-2 mt-3 text-muted-foreground">
                <Github className="size-4 hover:text-foreground cursor-pointer" />
                <Linkedin className="size-4 hover:text-foreground cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
