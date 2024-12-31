import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="font-bold text-lg">
          Job Portal
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/jobs" className="hover:underline">
          Jobs
        </Link>
        {session?.user?.userType === "employer" && (
          <Link href="/my-jobs" className="hover:underline">
            My Job Offers
          </Link>
        )}
        {!session ? (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <button onClick={() => signOut()} className="hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
