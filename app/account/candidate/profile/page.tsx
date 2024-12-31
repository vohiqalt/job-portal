"use client";

import { useEffect, useState } from "react";
import BasicInfoSection from "../components/BasicInfoSection";
import WorkExperienceSection from "../components/WorkExperienceSection";
import EducationSection from "../components/EducationSection";
import CertificatesSection from "../components/CertificatesSection";
import SkillsSection from "../components/SkillsSection";

// Types
interface WorkExperience {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Certificate {
  title: string;
  authority: string;
}

interface ProfileData {
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

export default function CandidateProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    photoURL: "",
    name: "",
    email: "",
    phoneNumber: "",
    personalWebsite: "",
    linkedIn: "",
    github: "",
    twitter: "",
    cv: "",
    workExperience: [],
    education: [],
    certificates: [],
    skills: [],
    languages: [],
    hobbies: [],
  });

  // Editing toggles
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [editingWork, setEditingWork] = useState(false);
  const [editingEducation, setEditingEducation] = useState(false);
  const [editingCerts, setEditingCerts] = useState(false);
  const [editingMisc, setEditingMisc] = useState(false);

  // Loading effect
  const [loading, setLoading] = useState(true);

  // Fetch Profile on Mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/user/profile", { method: "GET" });
        if (!response.ok) {
          console.error("Failed to fetch profile:", response.statusText);
          setLoading(false);
          return;
        }
        const data: ProfileData = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Save Profile to DB
  async function saveProfile() {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Failed to save profile.");
      // Successfully saved
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  }

  if (loading) {
    // Simple loading indicator
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <p className="text-xl">Loading Candidate Profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 text-white max-w-4xl mx-auto space-y-6 bg-gray-800">
      <h1 className="text-3xl font-bold">Candidate Profile</h1>

      <BasicInfoSection
        profileData={profileData}
        setProfileData={setProfileData}
        editing={editingBasicInfo}
        setEditing={setEditingBasicInfo}
        onSave={saveProfile}
      />

      <WorkExperienceSection
        profileData={profileData}
        setProfileData={setProfileData}
        editing={editingWork}
        setEditing={setEditingWork}
        onSave={saveProfile}
      />

      <EducationSection
        profileData={profileData}
        setProfileData={setProfileData}
        editing={editingEducation}
        setEditing={setEditingEducation}
        onSave={saveProfile}
      />

      <CertificatesSection
        profileData={profileData}
        setProfileData={setProfileData}
        editing={editingCerts}
        setEditing={setEditingCerts}
        onSave={saveProfile}
      />

      <SkillsSection
        profileData={profileData}
        setProfileData={setProfileData}
        editing={editingMisc}
        setEditing={setEditingMisc}
        onSave={saveProfile}
      />
    </div>
  );
}
