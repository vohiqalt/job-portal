"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Settings() {
  const { data: session } = useSession();

  // Keep track of job count for the user (if employer)
  const [jobCount, setJobCount] = useState<number | null>(null);
  // Manage whether the "confirm remove jobs" modal is open
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Current userType from session
  const currentType = session?.user?.userType || "job_seeker";
  const newType = currentType === "job_seeker" ? "employer" : "job_seeker";
  const currentTypeLabel =
    currentType === "job_seeker" ? "Candidate" : "Employer";
  const newTypeLabel = newType === "job_seeker" ? "Candidate" : "Employer";

  // 1) If user is employer, fetch job count on mount
  useEffect(() => {
    if (currentType === "employer") {
      fetch("/api/jobs/count")
        .then((res) => res.json())
        .then((data) => {
          if (data.jobCount !== undefined) {
            setJobCount(data.jobCount);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch job count:", err);
        });
    }
  }, [currentType]);

  // 2) The main function to update the account type
  async function handleAccountTypeChange() {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userType: newType }),
    });

    if (res.ok) {
      alert(
        `Account type updated to ${
          newType === "job_seeker" ? "Candidate" : "Employer"
        } successfully!`
      );
      window.location.reload();
    } else {
      const error = await res.json();
      alert(error.error || "Failed to update account type.");
    }
  }

  // 3) Handler for starting account type change
  function handleStartChangeAccountType() {
    // If going from employer -> candidate, show modal
    if (currentType === "employer" && newType === "job_seeker") {
      setShowConfirmModal(true);
    } else {
      // If going candidate->employer (or anything else), just do it
      handleAccountTypeChange();
    }
  }

  // 4) Delete account
  async function handleDeleteAccount() {
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
      signOut();
    }
  }

  if (!session) {
    // We do this check AFTER defining all hooks at the top
    return (
      <div className="text-white">
        You must be logged in to access this page.
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* Change Account Type */}
      <div className="mb-8 bg-gray-900 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Change Account Type</h2>
        <p className="mb-4">
          Change account type to <strong>{newTypeLabel}</strong> (currently:{" "}
          <strong>{currentTypeLabel}</strong>)
        </p>
        <button
          onClick={handleStartChangeAccountType}
          className="w-full bg-blue-600 p-3 rounded text-white hover:bg-blue-700 transition"
        >
          Change to {newTypeLabel}
        </button>
      </div>

      {/* Delete Account */}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-gray-700 p-6 rounded shadow-lg relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Confirm Account Change</h3>
            <p className="mb-4">
              You currently have{" "}
              <strong>{jobCount !== null ? jobCount : "?"}</strong> job
              listing(s). Switching to <strong>Candidate</strong> will
              <strong> permanently delete</strong> all your job postings, and
              you won’t be able to restore them even if you switch back to
              Employer later.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleAccountTypeChange();
                }}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete &amp; Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
