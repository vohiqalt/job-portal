"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiPlusCircle,
  FiList,
} from "react-icons/fi";
import { FaBookmark, FaEdit } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { ImFilesEmpty, ImProfile } from "react-icons/im";

export default function Navbar() {
  const { data: session } = useSession();
  const userType = session?.user?.userType; // "employer" | "job_seeker" | undefined

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // We'll use a ref to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle the dropdown when the user clicks the profile button
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close the dropdown if a click occurs outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="text-white bg-transparent p-4 flex justify-between items-center w-full max-w-screen-xl mx-auto">
      {/* Logo / Title */}
      <div>
        <Link href="/" className="font-bold text-xl tracking-wide">
          Job Portal
        </Link>
      </div>

      {/* Nav links on the right */}
      <div className="flex space-x-6">
        {/* Visible to all users */}
        <Link
          href="/jobs"
          className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
        >
          Jobs
        </Link>

        {/* Employer-only links in main navbar (optional) */}
        {userType === "employer" && (
          <>
            <Link
              href="/jobs/create"
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
            >
              <FiPlusCircle />
              <span>Add Job</span>
            </Link>
            <Link
              href="/my-jobs"
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
            >
              <FiList />
              <span>My Listings</span>
            </Link>
          </>
        )}

        {session ? (
          /* Dropdown menu trigger + items */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
            >
              <FiUser />
              <span>{session.user.name || "User"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded shadow-lg z-50">
                {/* Candidate-only dropdown items */}
                {userType === "job_seeker" && (
                  <>
                    <Link
                      href="/account/candidate/profile"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      <ImProfile className="inline mr-2" />
                      Candidate Profile
                    </Link>
                    <Link
                      href="/account/candidate/edit-resume"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit Resume
                    </Link>
                    <Link
                      href="/my-applications"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      <ImFilesEmpty className="inline mr-2" />
                      My Applications
                    </Link>
                    <Link
                      href="/jobs/saved"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      <FaBookmark className="inline mr-2" />
                      Saved Jobs
                    </Link>
                  </>
                )}

                {/* Employer-only dropdown items */}
                {userType === "employer" && (
                  <>
                    <Link
                      href="/account/company/profile"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      <FaBuilding className="inline mr-2" />
                      Company Profile
                    </Link>
                    <Link
                      href="/applications"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      <ImFilesEmpty className="inline mr-2" />
                      Manage Applications
                    </Link>
                  </>
                )}

                {/* Shared items for all logged-in users */}
                <Link
                  href="/account/settings"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  <FiSettings className="inline mr-2" />
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  <FiLogOut className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // If user not logged in, show login/register
          <>
            <Link
              href="/login"
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
