import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiPlusCircle,
  FiList,
} from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
        {session?.user?.userType === "employer" && (
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
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
            >
              <FiUser />
              <span>Account</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg">
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
