"use client";

import { useSession, signOut } from "next-auth/react";

export default function Settings() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="text-white">
        You must be logged in to access this page.
      </div>
    );
  }

  const currentType = session?.user?.userType || "job_seeker";
  console.log(currentType);
  const newType = currentType === "job_seeker" ? "employer" : "job_seeker";
  const currentTypeLabel =
    currentType === "job_seeker" ? "Candidate" : "Employer";
  const newTypeLabel = newType === "job_seeker" ? "Candidate" : "Employer";

  async function handleAccountTypeChange() {
    const currentType = session?.user?.userType; // Example: job_seeker
    const newType = currentType === "job_seeker" ? "employer" : "job_seeker";

    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userType: newType }), // Send correct type
    });

    if (res.ok) {
      alert(
        `Account type updated to ${
          newType === "job_seeker" ? "Candidate" : "Employer"
        } successfully!`
      );
      window.location.reload(); // Reload the page to reflect changes
    } else {
      const error = await res.json();
      alert(error.error || "Failed to update account type.");
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    const response = await fetch("/api/user/delete", {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete account. Please try again later.");
    } else {
      alert("Account deleted successfully.");
      signOut(); // Log the user out after account deletion
    }
  };

  return (
    <div className="max-w-screen-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* Block for Changing Account Type */}
      <div className="mb-8 bg-gray-900 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Change Account Type</h2>
        <p className="mb-4">
          Change account type to <strong>{newTypeLabel}</strong> (currently:{" "}
          <strong>{currentTypeLabel}</strong>)
        </p>
        <button
          onClick={handleAccountTypeChange}
          className="w-full bg-blue-600 p-3 rounded text-white hover:bg-blue-700 transition"
        >
          Change to {newTypeLabel}
        </button>
      </div>

      {/* Block for Deleting Account */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Delete Account</h2>
        <p className="text-sm mb-4">
          Deleting your account is permanent and cannot be undone. This action
          will remove all your data.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 p-3 rounded text-white hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
