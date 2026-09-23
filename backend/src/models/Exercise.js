import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    muscleGroup: { type: String, required: true, trim: true, maxlength: 50 },
    equipment: { type: String, required: true, trim: true, maxlength: 50 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

exerciseSchema.index({ user: 1, name: 1 });

export default mongoose.model("Exercise", exerciseSchema);
