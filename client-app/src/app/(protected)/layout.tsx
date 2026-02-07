import { redirect } from "next/navigation";

import { AuthProvider } from "@/entities/auth";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/widgets/header";
import { SessionCookieSync } from "./session-cookie-sync";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider initialUser={user}>
      <SessionCookieSync />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </AuthProvider>
  );
}
