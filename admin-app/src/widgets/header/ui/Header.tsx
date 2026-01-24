import { Link } from "react-router-dom";
import { useAuth } from "@/entities/auth";
import { ThemeSwitch } from "@/features/switch-theme";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/utils";

export type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={cn(
        "min-h-[72px] w-full px-4",
        "bg-background border-b border-border",
        "flex justify-between items-center gap-4",
        className
      )}
      data-testid="Header"
    >
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold hover:opacity-80">
          LearnBase Admin
        </Link>
        {user && (user.role === "author" || user.role === "admin") && (
          <Link
            to="/courses"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Courses
          </Link>
        )}
        {user && user.role === "admin" && (
          <Link
            to="/users"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Users
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-muted-foreground">
            {user.email} ({user.role})
          </div>
        )}
        <Button onClick={handleLogout} variant="ghost" size="sm">
          Logout
        </Button>
        <ThemeSwitch />
      </div>
    </header>
  );
};
