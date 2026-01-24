import { useEffect, useState } from "react";
import { useGetUsersQuery, type UserRole } from "@/entities/user";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/shared/ui";

export const UserList = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [emailFilter, setEmailFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");

  // Debounced фильтры для email и name
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(emailFilter);
      setPage(1); // Сбрасываем на первую страницу при изменении фильтра
    }, 500);
    return () => clearTimeout(timer);
  }, [emailFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(nameFilter);
      setPage(1); // Сбрасываем на первую страницу при изменении фильтра
    }, 500);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  const { data, isLoading, error } = useGetUsersQuery({
    page,
    itemsPerPage,
    email: debouncedEmail || undefined,
    name: debouncedName || undefined,
    role: roleFilter || undefined,
  });

  const handleRoleFilterChange = (value: UserRole | "") => {
    setRoleFilter(value);
    setPage(1); // Сбрасываем на первую страницу при изменении фильтра
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load users</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { users, pagination } = data;

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="email-filter">Email</Label>
              <Input
                id="email-filter"
                type="text"
                placeholder="Filter by email..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="name-filter">Name</Label>
              <Input
                id="name-filter"
                type="text"
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role-filter">Role</Label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) =>
                  handleRoleFilterChange(e.target.value as UserRole | "")
                }
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All roles</option>
                <option value="student">Student</option>
                <option value="author">Author</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список пользователей */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Showing {users.length} of {pagination.total} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{user.email}</div>
                      {user.name && (
                        <div className="text-sm text-muted-foreground">
                          {user.name}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Пагинация */}
          {pagination.totalPages > 1 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages} (
                    {pagination.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPreviousPage}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

