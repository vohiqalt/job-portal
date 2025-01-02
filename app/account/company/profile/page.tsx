"use client";

import { useEffect, useState } from "react";
import BasicInfoSection from "./components/BasicInfoSection";
import HowWeWorkSection from "./components/HowWeWorkSection";

interface CompanyData {
  companyLogo: string;
  companyName: string;
  email: string;
  companyDescription: string;
  howWeWork: string;
}

export default function CompanyProfilePage() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyLogo: "",
    companyName: "",
    email: "",
    companyDescription: "",
    howWeWork: "",
  });

  // Edit toggles
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [editingHowWeWork, setEditingHowWeWork] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchCompanyProfile() {
      try {
        const res = await fetch("/api/user/company-profile", { method: "GET" });
        if (!res.ok) {
          console.error("Failed to fetch company profile:", res.statusText);
          setLoading(false);
          return;
        }
        const data: CompanyData = await res.json();
        setCompanyData(data);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyProfile();
  }, []);

  // Save updated profile to the server
  async function saveCompanyProfile() {
    try {
      const res = await fetch("/api/user/company-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });
      if (!res.ok) throw new Error("Failed to update company profile");
    } catch (error) {
      console.error("Error updating company profile:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <p className="text-xl">Loading Company Profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 text-white max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Company Profile</h1>

      {/* Basic Info Section */}
      <BasicInfoSection
        companyData={companyData}
        setCompanyData={setCompanyData}
        editingBasicInfo={editingBasicInfo}
        setEditingBasicInfo={setEditingBasicInfo}
        onSave={saveCompanyProfile}
      />

      {/* How We Work Section */}
      <HowWeWorkSection
        companyData={companyData}
        setCompanyData={setCompanyData}
        editingHowWeWork={editingHowWeWork}
        setEditingHowWeWork={setEditingHowWeWork}
        onSave={saveCompanyProfile}
      />
    </div>
  );
}
