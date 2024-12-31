"use client";

import { Dispatch, SetStateAction } from "react";
import { ProfileData } from "../profile/types";

interface Props {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
}

export default function SkillsSection({
  profileData,
  setProfileData,
  editing,
  setEditing,
  onSave,
}: Props) {
  function handleChange(field: keyof ProfileData, value: string) {
    // Convert comma-separated string into array
    const arr = value.split(",").map((s) => s.trim());
    setProfileData((prev) => ({ ...prev, [field]: arr }));
  }

  async function handleToggleEdit() {
    if (editing) {
      await onSave();
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">
          Skills, Languages &amp; Hobbies
        </h2>
        <button
          onClick={handleToggleEdit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      {editing ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Skills (comma-separated)"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            value={profileData.skills.join(", ")}
            onChange={(e) => handleChange("skills", e.target.value)}
          />
          <input
            type="text"
            placeholder="Languages (comma-separated)"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            value={profileData.languages.join(", ")}
            onChange={(e) => handleChange("languages", e.target.value)}
          />
          <input
            type="text"
            placeholder="Hobbies (comma-separated)"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            value={profileData.hobbies.join(", ")}
            onChange={(e) => handleChange("hobbies", e.target.value)}
          />
        </div>
      ) : (
        <>
          <p className="text-gray-300">
            <strong>Skills:</strong>{" "}
            {profileData.skills.length > 0
              ? profileData.skills.join(", ")
              : "N/A"}
          </p>
          <p className="text-gray-300">
            <strong>Languages:</strong>{" "}
            {profileData.languages.length > 0
              ? profileData.languages.join(", ")
              : "N/A"}
          </p>
          <p className="text-gray-300">
            <strong>Hobbies:</strong>{" "}
            {profileData.hobbies.length > 0
              ? profileData.hobbies.join(", ")
              : "N/A"}
          </p>
        </>
      )}
    </div>
  );
}
