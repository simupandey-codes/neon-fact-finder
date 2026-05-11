import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getHistory, clearHistory } from "@/lib/history";
import type { AnalysisResult } from "@/lib/mockAi";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, FileSearch, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TruthLens AI" },
      { name: "description", content: "Visualize fake vs real news checks, trending misinformation topics, and your detection history." },
    ],
  }),
  component: Dashboard,
});

const COLORS = {
  fake: "oklch(0.68 0.25 20)",
  real: "oklch(0.75 0.2 155)",
  misleading: "oklch(0.82 0.18 85)",
};

const DEMO: AnalysisResult[] = [
  // seeded so empty state still looks rich
];

function Dashboard() {
  const [items, setItems] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const sync = () => setItems(getHistory());
    sync();
    window.addEventListener("truthlens-history", sync);
    return () => window.removeEventListener("truthlens-history", sync);
  }, []);

  const data = items.length > 0 ? items : DEMO;
  const counts = { fake: 0, real: 0, misleading: 0 };
  for (const r of data) counts[r.verdict]++;
  // Add some demo padding if empty so charts render
  const effective = data.length === 0
    ? { fake: 14, real: 22, misleading: 9 }
    : counts;

  const pieData = [
    { name: "Real", value: effective.real, key: "real" as const },
    { name: "Fake", value: effective.fake, key: "fake" as const },
    { name: "Misleading", value: effective.misleading, key: "misleading" as const },
  ];

  const trending = [
    { topic: "Politics", fake: 18, real: 6 },
    { topic: "Health", fake: 12, real: 14 },
    { topic: "Tech", fake: 5, real: 19 },
    { topic: "Climate", fake: 9, real: 11 },
    { topic: "Finance", fake: 7, real: 8 },
  ];

  const trend = Array.from({ length: 7 }).map((_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    checks: 3 + Math.round(Math.random() * 12) + (data.length > 0 && i === 6 ? data.length : 0),
  }));

  const total = effective.fake + effective.real + effective.misleading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-gradient">Insights</span> Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Live overview of your fact-checking activity.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="hero"><Link to="/detect">+ New check</Link></Button>
          {items.length > 0 && (
            <Button variant="ghost" onClick={() => clearHistory()}>
              <Trash2 /> Clear history
            </Button>
          )}
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPI icon={FileSearch} label="Total checks" value={total} accent="--neon" />
        <KPI icon={ShieldCheck} label="Real" value={effective.real} accent="--success" />
        <KPI icon={ShieldAlert} label="Fake" value={effective.fake} accent="--danger" />
        <KPI icon={AlertTriangle} label="Misleading" value={effective.misleading} accent="--warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pie chart */}
        <div className="glass p-6">
          <h3 className="font-semibold mb-1">Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">Fake vs real vs misleading</p>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {pieData.map((d) => <Cell key={d.key} fill={COLORS[d.key]} stroke="transparent" />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div className="glass p-6">
          <h3 className="font-semibold mb-1">Trending fake news topics</h3>
          <p className="text-sm text-muted-foreground mb-4">Last 30 days</p>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={trending}>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--border) 80%, transparent)" />
                <XAxis dataKey="topic" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="fake" fill={COLORS.fake} radius={[6, 6, 0, 0]} />
                <Bar dataKey="real" fill={COLORS.real} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line chart full width */}
        <div className="glass p-6 lg:col-span-2">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="size-4 text-[color:var(--neon)]" /> Weekly check activity
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Articles analyzed per day</p>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--border) 80%, transparent)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="checks" stroke="var(--neon)" strokeWidth={3} dot={{ fill: "var(--cyber)", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {data.length === 0 && (
        <p className="text-center text-xs text-muted-foreground mt-6">
          Showing demo data. Run a few checks to populate your dashboard.
        </p>
      )}
    </div>
  );
}

function KPI({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <div className="glass p-5 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 size-24 rounded-full opacity-20 blur-2xl" style={{ background: `var(${accent})` }} />
      <Icon className="size-5" style={{ color: `var(${accent})` }} />
      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-3">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
