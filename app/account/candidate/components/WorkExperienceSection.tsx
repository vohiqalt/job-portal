"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}
import { ProfileData } from "../profile/types";

interface Props {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
}

export default function WorkExperienceSection({
  profileData,
  setProfileData,
  editing,
  setEditing,
  onSave,
}: Props) {
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof WorkExperience
  ) {
    const newWork = [...profileData.workExperience];
    (newWork[index] as any)[field] = e.target.value;
    setProfileData((prev) => ({ ...prev, workExperience: newWork }));
  }

  function addWorkExperience() {
    setProfileData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          jobTitle: "",
          companyName: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  }

  async function handleToggleEdit() {
    if (editing) {
      // Save
      await onSave();
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <button
          onClick={handleToggleEdit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      {profileData.workExperience.length === 0 && (
        <p className="text-gray-400">No work experience yet.</p>
      )}

      {profileData.workExperience.map((exp, idx) =>
        editing ? (
          <div key={idx} className="mb-4 space-y-2">
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Job Title"
              value={exp.jobTitle}
              onChange={(e) => handleChange(e, idx, "jobTitle")}
            />
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Company Name"
              value={exp.companyName}
              onChange={(e) => handleChange(e, idx, "companyName")}
            />
            <div className="flex space-x-2">
              <input
                type="date"
                className="bg-gray-700 text-white px-2 py-1 rounded w-1/2"
                value={exp.startDate}
                onChange={(e) => handleChange(e, idx, "startDate")}
              />
              <input
                type="date"
                className="bg-gray-700 text-white px-2 py-1 rounded w-1/2"
                value={exp.endDate}
                onChange={(e) => handleChange(e, idx, "endDate")}
              />
            </div>
            <textarea
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Description"
              value={exp.description}
              onChange={(e) => handleChange(e, idx, "description")}
            />
          </div>
        ) : (
          <div key={idx} className="mb-4">
            <p className="text-gray-300 font-semibold">
              {exp.jobTitle} @ {exp.companyName}
            </p>
            <p className="text-gray-400">
              {exp.startDate || "N/A"} - {exp.endDate || "Present"}
            </p>
            <p className="text-gray-400">{exp.description}</p>
          </div>
        )
      )}

      {editing && (
        <button
          onClick={addWorkExperience}
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
        >
          + Add Work Experience
        </button>
      )}
    </div>
  );
}
