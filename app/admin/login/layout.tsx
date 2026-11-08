import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | SunHaven Lanka",
  description: "Secure administrator sign-in portal for SunHaven Lanka",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
