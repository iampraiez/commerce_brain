import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { MinimalBackground } from "@/components/minimal-background";
import { LoginForm } from "./login-form";

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = (params.callbackUrl as string) || null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      <MinimalBackground />
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-block mb-12">
          <div className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition">
            <Activity className="w-5 h-5 text-primary" />
            Nexus
          </div>
        </Link>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-light text-foreground">Sign In</h1>
          <p className="text-muted-foreground leading-relaxed">Welcome back to Nexus</p>
        </div>

        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
