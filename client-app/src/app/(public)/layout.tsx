import { AuthProvider } from "@/entities/auth";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider initialUser={null}>{children}</AuthProvider>;
}
