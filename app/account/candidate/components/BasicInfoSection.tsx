"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ProfileData } from "../profile/types";
import { IoIosGlobe } from "react-icons/io";
import { FaLinkedin, FaGithub, FaTwitter, FaFileAlt } from "react-icons/fa"; // LinkedIn, GitHub, Twitter, CV

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
    const path = urlObj.pathname.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
    return path.split("/").pop() || url; // Get the last segment of the path
  } catch {
    return url; // If invalid URL, return the full URL
  }
}

function stripWebsite(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, ""); // Remove "www."
  } catch {
    return url; // If invalid URL, return the full URL
  }
}

export default function BasicInfoSection({
  profileData,
  setProfileData,
  editing,
  setEditing,
  onSave,
}: Props) {
  // Update local fields
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  }

  // Toggle editing
  async function handleToggleEdit() {
    if (editing) {
      // User is about to save
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
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Name (required)"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          ) : (
            <p className="text-lg font-bold">{profileData.name || "Name"}</p>
          )}

          {/* Email */}
          {editing ? (
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Email (required)"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
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
              placeholder="Phone number (required)"
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
            placeholder="CV URL (required)"
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
