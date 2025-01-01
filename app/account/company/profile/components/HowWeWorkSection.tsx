"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { CompanyData } from "../types";

interface Props {
  companyData: CompanyData;
  setCompanyData: Dispatch<SetStateAction<CompanyData>>;
  editingHowWeWork: boolean;
  setEditingHowWeWork: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
}

export default function HowWeWorkSection({
  companyData,
  setCompanyData,
  editingHowWeWork,
  setEditingHowWeWork,
  onSave,
}: Props) {
  function handleHowWeWorkChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  }

  async function toggleEditHowWeWork() {
    if (editingHowWeWork) {
      await onSave();
      setEditingHowWeWork(false);
    } else {
      setEditingHowWeWork(true);
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">How We Work</h2>
        <button
          onClick={toggleEditHowWeWork}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingHowWeWork ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      {editingHowWeWork ? (
        <textarea
          name="howWeWork"
          value={companyData.howWeWork}
          onChange={handleHowWeWorkChange}
          placeholder="Describe your company's culture, values, or processes..."
          className="bg-gray-900 text-white px-2 py-1 rounded w-full min-h-[100px]"
        />
      ) : (
        <p className="text-gray-400">
          {companyData.howWeWork || "No information provided yet."}
        </p>
      )}
    </div>
  );
}
