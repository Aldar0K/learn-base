import { Suspense, type ReactNode } from "react";

export type SuspenseWrapperProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const SuspenseWrapper = ({
  children,
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  ),
}: SuspenseWrapperProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
