"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ProfileData } from "../profile/types";
import { IoIosGlobe } from "react-icons/io";
import { FaLinkedin, FaGithub, FaTwitter, FaFileAlt } from "react-icons/fa";

interface Props {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
}

function extractNickname(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.replace(/^\/+|\/+$/g, "");
    return path.split("/").pop() || url;
  } catch {
    return url;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function stripWebsite(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function BasicInfoSection({
  profileData,
  setProfileData,
  editing,
  setEditing,
  onSave,
}: Props) {
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    // Allow all input during editing
    setProfileData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleToggleEdit() {
    if (editing) {
      // Validate required fields on save
      if (!profileData.name.trim()) {
        alert("Name cannot be empty.");
        return;
      }
      if (
        profileData.userType === "employer" &&
        (!profileData.companyName || !profileData.companyName.trim())
      ) {
        alert("Company Name cannot be empty.");
        return;
      }
      if (!profileData.email.trim()) {
        alert("Email cannot be empty.");
        return;
      }
      if (!isValidEmail(profileData.email.trim())) {
        alert("Please enter a valid email address.");
        return;
      }

      await onSave();
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <button
          onClick={handleToggleEdit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Save Changes" : "Edit Section"}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Photo */}
        <div>
          {editing ? (
            <input
              type="text"
              name="photoURL"
              value={profileData.photoURL}
              onChange={handleChange}
              placeholder="Photo URL"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full mb-2"
            />
          ) : profileData.photoURL ? (
            <img
              src={profileData.photoURL}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-500 rounded-full text-gray-200">
              No Photo
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* Name */}
          {editing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Name (required)"
                className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              />
            </div>
          ) : (
            <p className="text-lg font-bold flex items-center">
              {profileData.name || "Name"}
              {!profileData.name && (
                <span className="text-red-500 font-bold ml-2">!</span>
              )}
            </p>
          )}

          {/* Email */}
          {editing ? (
            profileData.provider === "google" ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="bg-gray-700 text-gray-400 px-2 py-1 rounded w-full cursor-not-allowed"
              />
            ) : (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                placeholder="Email (required)"
                className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              />
            )
          ) : (
            <p className="text-gray-400">
              {profileData.email || "Email Address"}
            </p>
          )}

          {/* Phone */}
          {editing ? (
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          ) : (
            <p className="text-gray-400">
              {profileData.phoneNumber || "Phone Number"}
            </p>
          )}
        </div>
      </div>

      {/* Website, LinkedIn, GitHub, Twitter, CV */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Website */}
        {editing ? (
          <input
            type="text"
            name="personalWebsite"
            value={profileData.personalWebsite}
            onChange={handleChange}
            placeholder="Personal Website"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        ) : (
          <a
            href={profileData.personalWebsite || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
          >
            <IoIosGlobe className="text-xl" />
            {profileData.personalWebsite
              ? stripWebsite(profileData.personalWebsite)
              : "N/A"}
          </a>
        )}

        {/* LinkedIn */}
        {editing ? (
          <input
            type="text"
            name="linkedIn"
            value={profileData.linkedIn}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        ) : (
          <a
            href={profileData.linkedIn || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
          >
            <FaLinkedin className="text-xl" />
            {profileData.linkedIn
              ? extractNickname(profileData.linkedIn)
              : "N/A"}
          </a>
        )}

        {/* GitHub */}
        {editing ? (
          <input
            type="text"
            name="github"
            value={profileData.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        ) : (
          <a
            href={profileData.github || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
          >
            <FaGithub className="text-xl" />
            {profileData.github ? extractNickname(profileData.github) : "N/A"}
          </a>
        )}

        {/* Twitter */}
        {editing ? (
          <input
            type="text"
            name="twitter"
            value={profileData.twitter}
            onChange={handleChange}
            placeholder="Twitter URL"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        ) : (
          <a
            href={profileData.twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
          >
            <FaTwitter className="text-xl" />
            {profileData.twitter ? extractNickname(profileData.twitter) : "N/A"}
          </a>
        )}

        {/* CV */}
        {editing ? (
          <input
            type="text"
            name="cv"
            value={profileData.cv}
            onChange={handleChange}
            placeholder="CV URL"
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        ) : (
          <a
            href={profileData.cv || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400"
          >
            <FaFileAlt className="text-xl" />
            {profileData.cv ? "Download" : "N/A"}
          </a>
        )}
      </div>
    </div>
  );
}
