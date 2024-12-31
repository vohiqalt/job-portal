import mongoose from "mongoose";
import { PiHockey } from "react-icons/pi";

const WorkExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false }, // or true if always required
  description: { type: String, default: "" },
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  description: { type: String, default: "" },
});

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authority: { type: String, required: true },
  date: { type: Date, required: false },
});

const UserSchema = new mongoose.Schema({
  // ---------------------
  // Common Fields
  // ---------------------
  name: {
    type: String,
    required: true, // for all users
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["job_seeker", "employer"],
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },

  // -------------------------------------------------
  // Candidate (Job Seeker) Specific Fields
  // -------------------------------------------------
  photoURL: { type: String, default: "" }, // store URL
  phoneNumber: { type: String, default: "" },
  personalWebsite: { type: String, default: "" },
  linkedIn: { type: String, default: "" },
  github: { type: String, default: "" },
  twitter: { type: String, default: "" },
  cv: { type: String, default: "" }, // could store URL to uploaded CV

  workExperience: { type: [WorkExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  certificates: { type: [CertificateSchema], default: [] },
  skills: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  hobbies: { type: [String], default: [] },

  // -------------------------------------------------
  // Employer Specific Fields
  // -------------------------------------------------
  companyLogo: { type: String, default: "" }, // store URL to logo
  companyName: { type: String, default: "" },
  companyDescription: { type: String, default: "" },
  howWeWork: { type: String, default: "" },
  // ...any other employer fields...
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
