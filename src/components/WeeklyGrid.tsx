import { motion } from "framer-motion";
import { Habit, HabitLog, getWeekDates } from "@/lib/habits";

interface WeeklyGridProps {
  habits: Habit[];
  logs: HabitLog;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyGrid({ habits, logs }: WeeklyGridProps) {
  const weekDates = getWeekDates();
  const today = new Date().toISOString().split("T")[0];

  if (habits.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 overflow-x-auto">
      <h2 className="font-display text-lg mb-4">This Week</h2>
      <div className="min-w-[400px]">
        {/* Header */}
        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `1fr repeat(7, 40px)` }}>
          <div />
          {DAY_LABELS.map((d, i) => (
            <div
              key={d}
              className={`text-xs text-center font-medium ${
                weekDates[i] === today ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Rows */}
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="grid gap-2 items-center py-1.5"
            style={{ gridTemplateColumns: `1fr repeat(7, 40px)` }}
          >
            <span className="text-sm truncate pr-2">
              {habit.emoji} {habit.name}
            </span>
            {weekDates.map((date) => {
              const done = (logs[habit.id] || []).includes(date);
              const isToday = date === today;
              return (
                <div key={date} className="flex justify-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: done ? "hsl(var(--accent))" : "hsl(var(--muted))",
                      scale: done ? 1 : 0.85,
                    }}
                    className={`h-6 w-6 rounded-md ${isToday ? "ring-2 ring-primary/40" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
