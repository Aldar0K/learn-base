"use client";

import { useNavigate } from "react-router-dom";
import { ThemeSwitch } from "@/features/switch-theme";
import { useAuth } from "@/entities/user";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/utils";

export type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
      <div className="flex items-center">
        <h1 className="text-xl font-bold">LearnBase Admin</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-muted-foreground">
            {user.email} ({user.role})
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
        >
          Logout
        </Button>
        <ThemeSwitch />
      </div>
    </header>
  );
};
