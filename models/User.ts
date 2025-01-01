import mongoose from "mongoose";

const WorkExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
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
  // Common Fields
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function (this: any) {
      return this.provider === "credentials"; // Required only for manual registration
    },
  },
  userType: { type: String, enum: ["job_seeker", "employer"], required: true },
  provider: { type: String, default: "credentials" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },

  // Candidate (Job Seeker) Specific Fields
  photoURL: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  personalWebsite: { type: String, default: "" },
  linkedIn: { type: String, default: "" },
  github: { type: String, default: "" },
  twitter: { type: String, default: "" },
  cv: { type: String, default: "" },
  workExperience: { type: [WorkExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  certificates: { type: [CertificateSchema], default: [] },
  skills: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  hobbies: { type: [String], default: [] },

  // Employer Specific Fields
  companyLogo: { type: String, default: "" },
  companyName: { type: String, default: "" },
  companyDescription: { type: String, default: "" },
  howWeWork: { type: String, default: "" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
