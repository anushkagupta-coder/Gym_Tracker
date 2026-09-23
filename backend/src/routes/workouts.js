import express from "express";
import mongoose from "mongoose";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

async function validateExerciseOwnership(userId, exerciseIds) {
  const ids = [...new Set(exerciseIds.map(String))];
  const owned = await Exercise.countDocuments({
    _id: { $in: ids },
    user: userId
  });
  return owned === ids.length;
}

router.get("/", async (req, res) => {
  const workouts = await Workout.find({ user: req.userId })
    .populate("exercises.exercise", "name muscleGroup equipment")
    .sort({ date: -1, createdAt: -1 });

  res.json(workouts);
});

router.post("/", async (req, res) => {
  try {
    const { name, date, notes, exercises = [] } = req.body;

    if (!name || !date) {
      return res.status(400).json({ message: "Workout name and date are required" });
    }

    const exerciseIds = exercises.map((item) => item.exercise);
    if (!await validateExerciseOwnership(req.userId, exerciseIds)) {
      return res.status(403).json({ message: "Invalid exercise selection" });
    }

    const workout = await Workout.create({
      user: req.userId,
      name,
      date,
      notes,
      exercises
    });

    const populated = await workout.populate("exercises.exercise", "name muscleGroup equipment");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not create workout" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, date, notes, exercises = [] } = req.body;

    if (!await validateExerciseOwnership(req.userId, exercises.map((item) => item.exercise))) {
      return res.status(403).json({ message: "Invalid exercise selection" });
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, date, notes, exercises },
      { new: true, runValidators: true }
    ).populate("exercises.exercise", "name muscleGroup equipment");

    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not update workout" });
  }
});

router.delete("/:id", async (req, res) => {
  const workout = await Workout.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
  });

  if (!workout) return res.status(404).json({ message: "Workout not found" });
  res.json({ message: "Workout deleted" });
});

export default router;
