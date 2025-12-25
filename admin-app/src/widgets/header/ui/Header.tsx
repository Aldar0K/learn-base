import { ThemeSwitch } from "@/features/switch-theme";
import { cn } from "@/shared/utils";

export type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
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
        <ThemeSwitch />
      </div>
    </header>
  );
};
