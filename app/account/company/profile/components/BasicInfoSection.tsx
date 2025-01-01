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
  const MIN_DESCRIPTION_LENGTH = 10;
  const MAX_DESCRIPTION_LENGTH = 500;

  function handleBasicInfoChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  }

  async function toggleEditBasicInfo() {
    if (editingBasicInfo) {
      // Validation for required fields
      if (!companyData.companyName.trim()) {
        alert("Company Name cannot be empty.");
        return;
      }

      const descriptionLength = companyData.companyDescription.trim().length;
      if (
        descriptionLength < MIN_DESCRIPTION_LENGTH ||
        descriptionLength > MAX_DESCRIPTION_LENGTH
      ) {
        alert(
          `Company Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters.`
        );
        return;
      }

      // User clicked Save
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
          {/* Company Name */}
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
            <p className="text-lg font-bold flex items-center">
              {companyData.companyName || "Company Name"}
              {!companyData.companyName && (
                <span className="text-red-500 font-bold ml-2">!</span>
              )}
            </p>
          )}

          {/* Company Description */}
          {editingBasicInfo ? (
            <textarea
              name="companyDescription"
              value={companyData.companyDescription}
              onChange={handleBasicInfoChange}
              placeholder={`Company Description (required, ${MIN_DESCRIPTION_LENGTH}-${MAX_DESCRIPTION_LENGTH} characters)`}
              className="bg-gray-900 text-white px-2 py-1 rounded w-full min-h-[80px]"
            />
          ) : (
            <p className="text-gray-400 flex items-center">
              {companyData.companyDescription || "Company Description"}
              {companyData.companyDescription.trim().length <
                MIN_DESCRIPTION_LENGTH && (
                <span className="text-red-500 font-bold ml-2">!</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
