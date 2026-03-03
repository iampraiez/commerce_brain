"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  callbackUrl: string | null;
}

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (password: string) => {
    // 8+ chars, upper, lower, numbers
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpper && hasLower && hasNumber && hasMinLength;
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Frontend Validation
    if (companyName.length < 5) {
      setError("Company Name must be at least 5 characters long");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and numbers");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Redirect to email verification
      const verifyUrl = `/auth/verify-email?companyId=${data.data.companyId}${
        callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ""
      }`;
      router.push(verifyUrl);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 border border-border/50 bg-card/30 backdrop-blur rounded-lg">
      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Your Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            At least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="text-primary hover:text-primary/80 transition font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
