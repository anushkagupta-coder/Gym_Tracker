import express from "express";
import Exercise from "../models/Exercise.js";
import Workout from "../models/Workout.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const exercises = await Exercise.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(exercises);
});

router.post("/", async (req, res) => {
  try {
    const { name, muscleGroup, equipment } = req.body;
    if (!name || !muscleGroup || !equipment) {
      return res.status(400).json({ message: "All exercise fields are required" });
    }

    const exercise = await Exercise.create({
      name,
      muscleGroup,
      equipment,
      user: req.userId
    });

    res.status(201).json(exercise);
  } catch (err){
    console.error("CREATE EXERCISE ERROR:", err);
    res.status(500).json({
    message: "Could not create exercise",
    error: err.message
  });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        name: req.body.name,
        muscleGroup: req.body.muscleGroup,
        equipment: req.body.equipment
      },
      { new: true, runValidators: true }
    );

    if (!exercise) return res.status(404).json({ message: "Exercise not found" });
    res.json(exercise);
  } catch {
    res.status(500).json({ message: "Could not update exercise" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!exercise) return res.status(404).json({ message: "Exercise not found" });

    // Remove this exercise from the user's workout documents.
    await Workout.updateMany(
      { user: req.userId },
      { $pull: { exercises: { exercise: exercise._id } } }
    );

    res.json({ message: "Exercise deleted" });
  } catch {
    res.status(500).json({ message: "Could not delete exercise" });
  }
});

export default router;
