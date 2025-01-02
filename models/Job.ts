import mongoose, { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    location: {
      type: Schema.Types.Mixed, // Allow both string and object
      required: true,
    },
    flag: { type: String, default: null }, // Add flag URL
    salary: { type: Number },
    description: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    tags: [{ type: String }], // Array of tags
  },
  { timestamps: true }
);

const Job = models.Job || model("Job", JobSchema);

export default Job;
