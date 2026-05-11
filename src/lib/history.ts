import type { AnalysisResult } from "./mockAi";

const KEY = "truthlens-history";

export function getHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveResult(r: AnalysisResult) {
  if (typeof window === "undefined") return;
  const list = [r, ...getHistory()].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("truthlens-history"));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("truthlens-history"));
}
