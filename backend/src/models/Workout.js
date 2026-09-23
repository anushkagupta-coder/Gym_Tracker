import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    weight: { type: Number, required: true, min: 0 },
    reps: { type: Number, required: true, min: 1 }
  },
  { _id: true }
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    sets: {
      type: [setSchema],
      validate: {
        validator: (sets) => sets.length > 0,
        message: "Each workout exercise needs at least one set"
      }
    }
  },
  { _id: true }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 500 },
    exercises: { type: [workoutExerciseSchema], default: [] }
  },
  { timestamps: true }
);

workoutSchema.index({ user: 1, date: -1 });

export default mongoose.model("Workout", workoutSchema);
