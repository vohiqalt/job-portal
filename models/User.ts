import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userType: { type: String, enum: ["job_seeker", "employer"], required: true },
});

const User = models.User || model("User", UserSchema);

export default User;
