import express from "express";
import Workout from "../models/Workout.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

function dayKey(value) {
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

function calculateStreaks(workouts) {
  const uniqueDays = [...new Set(workouts.map((w) => dayKey(w.date)))].sort().reverse();

  if (!uniqueDays.length) {
    return { currentStreak: 0, longestStreak: 0, activeDays: [] };
  }

  const dayMs = 86400000;
  const timestamps = uniqueDays.map((d) => Date.parse(`${d}T00:00:00Z`));

  let longest = 1;
  let running = 1;

  for (let i = 1; i < timestamps.length; i++) {
    if (timestamps[i - 1] - timestamps[i] === dayMs) {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 1;
    }
  }

  const today = dayKey(new Date());
  const yesterday = dayKey(Date.now() - dayMs);
  let current = 0;

  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    current = 1;
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i - 1] - timestamps[i] === dayMs) current++;
      else break;
    }
  }

  return { currentStreak: current, longestStreak: longest, activeDays: uniqueDays };
}

router.get("/", async (req, res) => {
  const workouts = await Workout.find({ user: req.userId })
    .populate("exercises.exercise", "name muscleGroup")
    .sort({ date: -1 });

  let totalVolume = 0;
  let totalExercises = 0;

  for (const workout of workouts) {
    totalExercises += workout.exercises.length;
    for (const item of workout.exercises) {
      for (const set of item.sets) totalVolume += set.weight * set.reps;
    }
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const workoutsThisWeek = workouts.filter((w) => new Date(w.date) >= weekAgo).length;
  const streaks = calculateStreaks(workouts);

  const muscleMap = {};
  for (const workout of workouts) {
    for (const item of workout.exercises) {
      const group = item.exercise?.muscleGroup || "Other";
      muscleMap[group] = (muscleMap[group] || 0) + item.sets.length;
    }
  }

  const recent = workouts.slice(0, 7).map((w) => ({
    date: dayKey(w.date),
    volume: w.exercises.reduce(
      (sum, item) => sum + item.sets.reduce((s, set) => s + set.weight * set.reps, 0),
      0
    ),
    name: w.name
  })).reverse();

  res.json({
    totalWorkouts: workouts.length,
    totalExercises,
    totalVolume,
    workoutsThisWeek,
    ...streaks,
    muscleDistribution: Object.entries(muscleMap).map(([name, value]) => ({ name, value })),
    recent
  });
});

export default router;
