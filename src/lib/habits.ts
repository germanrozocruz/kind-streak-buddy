export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export interface HabitLog {
  [habitId: string]: string[]; // array of date strings "YYYY-MM-DD"
}

const HABITS_KEY = "habit-tracker-habits";
const LOGS_KEY = "habit-tracker-logs";

export function loadHabits(): Habit[] {
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadLogs(): HabitLog {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveLogs(logs: HabitLog) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export function getStreak(logs: HabitLog, habitId: string): number {
  const dates = logs[habitId] || [];
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (sorted[0] !== today && sorted[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function isCompletedToday(logs: HabitLog, habitId: string): boolean {
  return (logs[habitId] || []).includes(todayStr());
}

export const EMOJI_OPTIONS = ["💪", "📚", "🏃", "💧", "🧘", "✍️", "🎯", "💤", "🥗", "🎵", "🧠", "🌿"];
