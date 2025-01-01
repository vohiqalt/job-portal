"use client";

import { useSession, signOut } from "next-auth/react";

export default function Settings() {
  const { data: session } = useSession();

  // 1) Delete account
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
    return (
      <div className="text-white">
        You must be logged in to access this page.
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

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
    </div>
  );
}
