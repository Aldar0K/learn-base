import { Header } from "@/widgets/header";
import { CreateUserForm } from "@/features/create-user";
import { Card, CardContent, CardHeader, CardTitle, SuspenseWrapper } from "@/shared/ui";

export const CreateUserPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SuspenseWrapper>
        <Header />
      </SuspenseWrapper>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

