import { motion } from "framer-motion";
import { Target, Flame, CheckCircle2 } from "lucide-react";
import { Habit, HabitLog, isCompletedToday, getStreak } from "@/lib/habits";

interface StatsBarProps {
  habits: Habit[];
  logs: HabitLog;
}

export default function StatsBar({ habits, logs }: StatsBarProps) {
  const completedToday = habits.filter((h) => isCompletedToday(logs, h.id)).length;
  const total = habits.length;
  const bestStreak = Math.max(0, ...habits.map((h) => getStreak(logs, h.id)));
  const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0;

  const stats = [
    { icon: CheckCircle2, label: "Done today", value: `${completedToday}/${total}` },
    { icon: Target, label: "Completion", value: `${pct}%` },
    { icon: Flame, label: "Best streak", value: `${bestStreak}d` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-4 text-center"
        >
          <s.icon className="h-5 w-5 mx-auto mb-1.5 text-primary" />
          <p className="text-xl font-bold font-display">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
