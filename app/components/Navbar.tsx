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
  const companyName = session?.user?.companyName;
  const userName = session?.user?.name;

  const displayName =
    userType === "employer"
      ? companyName || "Company"
      : userName?.split(" ")[0] || "User"; // Use company name or first name

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
      <div>
        <Link href="/" className="font-bold text-xl tracking-wide">
          Job Portal
        </Link>
      </div>

      <div className="flex space-x-6">
        <Link
          href="/jobs"
          className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
        >
          Jobs
        </Link>

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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
            >
              <FiUser />
              <span className="flex items-center space-x-1">
                <span>{displayName}</span>
                {((userType === "job_seeker" && !userName) ||
                  (userType === "employer" && !companyName)) && (
                  <span className="pl-1 text-red-500 font-bold">!</span>
                )}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded shadow-lg z-50">
                {userType === "job_seeker" && (
                  <>
                    <Link
                      href="/account/candidate/profile"
                      className="block px-4 py-2 hover:bg-gray-700 flex justify-between items-center"
                    >
                      <span>
                        <ImProfile className="inline mr-2" />
                        Candidate Profile
                      </span>
                      {!userName && (
                        <span className="text-red-500 font-bold">!</span>
                      )}
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

                {userType === "employer" && (
                  <>
                    <Link
                      href="/account/company/profile"
                      className="block px-4 py-2 hover:bg-gray-700 flex justify-between items-center"
                    >
                      <span>
                        <FaBuilding className="inline mr-2" />
                        Company Profile
                      </span>
                      {!companyName && (
                        <span className="text-red-500 font-bold">!</span>
                      )}
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

                <Link
                  href="/account/settings"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  <FiSettings className="inline mr-2" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  <FiLogOut className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
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
