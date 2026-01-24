import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SuspenseWrapper,
} from "@/shared/ui";
import { UserList } from "@/widgets/user-list";
import { Header } from "@/widgets/header";
import { Link } from "react-router-dom";

export const UsersPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SuspenseWrapper>
        <Header />
      </SuspenseWrapper>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Users</CardTitle>
              <Button asChild>
                <Link to="/users/create">Create User</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SuspenseWrapper>
              <UserList />
            </SuspenseWrapper>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

