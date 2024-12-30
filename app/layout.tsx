import "./globals.css";
import Layout from "./components/Layout";

export const metadata = {
  title: "Job Portal",
  description: "Find your next career opportunity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
