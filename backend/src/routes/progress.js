import express from "express";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

const oneRM = (weight, reps) => weight * (1 + reps / 30);

router.get("/:exerciseId", async (req, res) => {
  const exercise = await Exercise.findOne({
    _id: req.params.exerciseId,
    user: req.userId
  });

  if (!exercise) return res.status(404).json({ message: "Exercise not found" });

  const workouts = await Workout.find({
    user: req.userId,
    "exercises.exercise": exercise._id
  }).sort({ date: 1 });

  const sessions = [];

  for (const workout of workouts) {
    const item = workout.exercises.find(
      (entry) => entry.exercise.toString() === exercise._id.toString()
    );
    if (!item) continue;

    const bestWeight = Math.max(...item.sets.map((s) => s.weight));
    const bestReps = Math.max(...item.sets.map((s) => s.reps));
    const bestSet = item.sets.reduce(
      (best, current) =>
        oneRM(current.weight, current.reps) > oneRM(best.weight, best.reps) ? current : best,
      item.sets[0]
    );

    sessions.push({
      workoutId: workout._id,
      workoutName: workout.name,
      date: workout.date,
      bestWeight,
      bestReps,
      estimated1RM: Number(oneRM(bestSet.weight, bestSet.reps).toFixed(1))
    });
  }

  const current = sessions.at(-1) || null;
  const previous = sessions.at(-2) || null;

  let trend = "Maintained";
  if (current && previous) {
    if (current.estimated1RM > previous.estimated1RM) trend = "Improved";
    else if (current.estimated1RM < previous.estimated1RM) trend = "Decreased";
  }

  res.json({
    exercise,
    current,
    previous,
    trend,
    bestWeight: sessions.length ? Math.max(...sessions.map((s) => s.bestWeight)) : 0,
    bestReps: sessions.length ? Math.max(...sessions.map((s) => s.bestReps)) : 0,
    history: sessions
  });
});

export default router;
