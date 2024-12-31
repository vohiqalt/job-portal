import mongoose, { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: false },
    description: { type: String, required: true },
    isHidden: { type: Boolean, default: false }, // Default to false
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = models.Job || model("Job", JobSchema);

export default Job;
