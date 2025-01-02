"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Certificate {
  title: string;
  authority: string;
}
import { ProfileData } from "../profile/types";

interface Props {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
}

export default function CertificatesSection({
  profileData,
  setProfileData,
  editing,
  setEditing,
  onSave,
}: Props) {
  function handleChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Certificate
  ) {
    const newCerts = [...profileData.certificates];
    (newCerts[index] as any)[field] = e.target.value;
    setProfileData((prev) => ({ ...prev, certificates: newCerts }));
  }

  function addCertificate() {
    setProfileData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, { title: "", authority: "" }],
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
        <h2 className="text-xl font-semibold">Certificates</h2>
        <button
          onClick={handleToggleEdit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      {profileData.certificates.length === 0 && (
        <p className="text-gray-400">No certificates added.</p>
      )}

      {profileData.certificates.map((cert, idx) =>
        editing ? (
          <div key={idx} className="mb-4 space-y-2">
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Certificate Title"
              value={cert.title}
              onChange={(e) => handleChange(e, idx, "title")}
            />
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Authority"
              value={cert.authority}
              onChange={(e) => handleChange(e, idx, "authority")}
            />
          </div>
        ) : (
          <div key={idx} className="mb-4">
            <p className="text-gray-300 font-semibold">{cert.title}</p>
            <p className="text-gray-400">Issued by {cert.authority}</p>
          </div>
        )
      )}

      {editing && (
        <button
          onClick={addCertificate}
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
        >
          + Add Certificate
        </button>
      )}
    </div>
  );
}
