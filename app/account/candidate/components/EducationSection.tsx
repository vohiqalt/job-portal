"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Education {
  institution: string;
  degree: string;
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

export default function EducationSection({
  profileData,
  setProfileData,
  editing,
  setEditing,
  onSave,
}: Props) {
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof Education
  ) {
    const newEdu = [...profileData.education];
    (newEdu[index] as any)[field] = e.target.value;
    setProfileData((prev) => ({ ...prev, education: newEdu }));
  }

  function addEducation() {
    setProfileData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
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
        <h2 className="text-xl font-semibold">Education</h2>
        <button
          onClick={handleToggleEdit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      {profileData.education.length === 0 && (
        <p className="text-gray-400">No education details yet.</p>
      )}

      {profileData.education.map((edu, idx) =>
        editing ? (
          <div key={idx} className="mb-4 space-y-2">
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleChange(e, idx, "institution")}
            />
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleChange(e, idx, "degree")}
            />
            <div className="flex space-x-2">
              <input
                type="date"
                className="bg-gray-700 text-white px-2 py-1 rounded w-1/2"
                value={edu.startDate}
                onChange={(e) => handleChange(e, idx, "startDate")}
              />
              <input
                type="date"
                className="bg-gray-700 text-white px-2 py-1 rounded w-1/2"
                value={edu.endDate}
                onChange={(e) => handleChange(e, idx, "endDate")}
              />
            </div>
            <textarea
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Description"
              value={edu.description}
              onChange={(e) => handleChange(e, idx, "description")}
            />
          </div>
        ) : (
          <div key={idx} className="mb-4">
            <p className="text-gray-300 font-semibold">{edu.institution}</p>
            <p className="text-gray-400">
              {edu.degree} ({edu.startDate || "N/A"} -{" "}
              {edu.endDate || "Present"})
            </p>
            <p className="text-gray-400">{edu.description}</p>
          </div>
        )
      )}

      {editing && (
        <button
          onClick={addEducation}
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
        >
          + Add Education
        </button>
      )}
    </div>
  );
}
