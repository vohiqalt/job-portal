"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface CompanyData {
  companyLogo: string;
  companyName: string;
  companyDescription: string;
  howWeWork: string;
}

interface Props {
  companyData: CompanyData;
  setCompanyData: Dispatch<SetStateAction<CompanyData>>;
  editingBasicInfo: boolean;
  setEditingBasicInfo: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
}

export default function BasicInfoSection({
  companyData,
  setCompanyData,
  editingBasicInfo,
  setEditingBasicInfo,
  onSave,
}: Props) {
  function handleBasicInfoChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  }

  async function toggleEditBasicInfo() {
    if (editingBasicInfo) {
      // user clicked Save
      await onSave();
      setEditingBasicInfo(false);
    } else {
      setEditingBasicInfo(true);
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <button
          onClick={toggleEditBasicInfo}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingBasicInfo ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div>
          {editingBasicInfo ? (
            <input
              type="text"
              name="companyLogo"
              value={companyData.companyLogo}
              onChange={handleBasicInfoChange}
              placeholder="Company Logo URL (required)"
              className="bg-gray-900 text-white px-2 py-1 rounded w-full mb-2"
            />
          ) : companyData.companyLogo ? (
            <img
              src={companyData.companyLogo}
              alt="Company Logo"
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded text-gray-400">
              No Logo
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {editingBasicInfo ? (
            <input
              type="text"
              name="companyName"
              value={companyData.companyName}
              onChange={handleBasicInfoChange}
              placeholder="Company Name (required)"
              className="bg-gray-900 text-white px-2 py-1 rounded w-full"
            />
          ) : (
            <p className="text-lg font-bold">
              {companyData.companyName || "Company Name"}
            </p>
          )}

          {editingBasicInfo ? (
            <textarea
              name="companyDescription"
              value={companyData.companyDescription}
              onChange={handleBasicInfoChange}
              placeholder="Company Description (required)"
              className="bg-gray-900 text-white px-2 py-1 rounded w-full min-h-[80px]"
            />
          ) : (
            <p className="text-gray-400">
              {companyData.companyDescription || "Company Description"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
