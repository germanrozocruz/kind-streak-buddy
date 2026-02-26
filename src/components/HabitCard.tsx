import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Trash2 } from "lucide-react";
import { Habit, HabitLog, isCompletedToday, getStreak } from "@/lib/habits";

interface HabitCardProps {
  habit: Habit;
  logs: HabitLog;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, logs, onToggle, onDelete }: HabitCardProps) {
  const completed = isCompletedToday(logs, habit.id);
  const streak = getStreak(logs, habit.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group relative flex items-center gap-4 rounded-lg border p-4 transition-colors ${
        completed
          ? "border-accent/40 bg-accent/10"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          completed
            ? "border-accent bg-accent text-accent-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        }`}
      >
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.span
              key="emoji"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-lg"
            >
              {habit.emoji}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium transition-all ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {habit.name}
        </p>
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 mt-0.5"
          >
            <Flame className="h-3.5 w-3.5 text-habit-streak" />
            <span className="text-xs text-habit-streak font-semibold">
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
          </motion.div>
        )}
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
