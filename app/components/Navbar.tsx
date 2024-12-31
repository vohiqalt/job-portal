import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiLogIn, FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();

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
          <Link
            href="/my-jobs"
            className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
          >
            My Job Offers
          </Link>
        )}
        {!session ? (
          <>
            <Link
              href="/login"
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              <FiLogIn className="inline mr-2" />
              Login
            </Link>
            <Link
              href="/register"
              className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              <FiUser className="inline mr-2" />
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={() => signOut()}
            className="hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
          >
            <FiLogOut className="inline mr-2" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
