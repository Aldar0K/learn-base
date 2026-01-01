"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/entities/auth";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export const RegisterForm = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(email, password);
      // Навигация произойдет автоматически через useEffect в AuthProvider
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      setError(
        error?.data?.message ||
          (error?.status === 409
            ? "User already exists"
            : "Registration failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Sign up</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1 border-b border-x-0 border-t-0 rounded-none px-0"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 border-b border-x-0 border-t-0 rounded-none px-0"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>

          <div className="pt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
