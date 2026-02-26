import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import WeeklyGrid from "@/components/WeeklyGrid";
import StatsBar from "@/components/StatsBar";
import {
  Habit,
  HabitLog,
  loadHabits,
  saveHabits,
  loadLogs,
  saveLogs,
  todayStr,
} from "@/lib/habits";

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [logs, setLogs] = useState<HabitLog>(loadLogs);
  const [dialogOpen, setDialogOpen] = useState(false);

  const addHabit = useCallback((name: string, emoji: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      emoji,
      createdAt: todayStr(),
    };
    setHabits((prev) => {
      const next = [...prev, newHabit];
      saveHabits(next);
      return next;
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => {
      const next = prev.filter((h) => h.id !== id);
      saveHabits(next);
      return next;
    });
    setLogs((prev) => {
      const next = { ...prev };
      delete next[id];
      saveLogs(next);
      return next;
    });
  }, []);

  const toggleToday = useCallback((id: string) => {
    setLogs((prev) => {
      const today = todayStr();
      const dates = prev[id] || [];
      const next = {
        ...prev,
        [id]: dates.includes(today)
          ? dates.filter((d) => d !== today)
          : [...dates, today],
      };
      saveLogs(next);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-display text-foreground mb-1">
            Habit Tracker
          </h1>
          <p className="text-muted-foreground text-sm">
            Small steps, every day ✨
          </p>
        </motion.div>

        {/* Stats */}
        {habits.length > 0 && (
          <div className="mb-6">
            <StatsBar habits={habits} logs={logs} />
          </div>
        )}

        {/* Habits list */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg">Today</h2>
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {habits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center"
            >
              <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium mb-1">No habits yet</p>
              <p className="text-sm text-muted-foreground/70">
                Tap "Add" to start building your routine
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    logs={logs}
                    onToggle={toggleToday}
                    onDelete={deleteHabit}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Weekly grid */}
        <WeeklyGrid habits={habits} logs={logs} />

        <AddHabitDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAdd={addHabit}
        />
      </div>
    </div>
  );
};

export default Index;
