// types.ts (shared)
export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certificate {
  title: string;
  authority: string;
}

export interface ProfileData {
  photoURL: string;
  name: string;
  email: string;
  phoneNumber: string;
  personalWebsite: string;
  linkedIn: string;
  github: string;
  twitter: string;
  cv: string;
  workExperience: WorkExperience[];
  education: Education[];
  certificates: Certificate[];
  skills: string[];
  languages: string[];
  hobbies: string[];
}
