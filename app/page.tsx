export const metadata = {
  title: "Job Portal",
  description: "Find your next career opportunity.",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to Job Portal
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Building your dream job platform.
      </p>
    </main>
  );
}
