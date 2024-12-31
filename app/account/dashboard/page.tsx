"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AccountDashboard() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    name: session?.user?.name || "",
    bio: session?.user?.bio || "",
    location: session?.user?.location || "",
    userType: session?.user?.userType || "job_seeker",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send updated data to the backend
    await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    alert("Account updated successfully!");
  };

  return (
    <div className="max-w-screen-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Account Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">Bio</label>
          <input
            type="text"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">Location</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">Account Type</label>
          <select
            name="userType"
            value={userData.userType}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 p-3 rounded text-white hover:bg-indigo-700 transition"
        >
          Update Account
        </button>
      </form>
    </div>
  );
}
