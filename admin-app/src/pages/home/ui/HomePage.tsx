import { useAuth } from "@/entities/auth";
import { SuspenseWrapper } from "@/shared/ui";
import { Header } from "@/widgets/header";

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <SuspenseWrapper>
        <Header />
      </SuspenseWrapper>
      <main className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-bold">LearnBase Admin</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.email} ({user?.role})
          </p>
        </div>
      </main>
    </div>
  );
};
