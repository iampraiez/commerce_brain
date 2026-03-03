import React from "react";
import { VerifyEmailForm } from "./verify-email-form";

interface VerifyEmailPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const companyId = (params.companyId as string) || null;
  const callbackUrl = (params.callbackUrl as string) || null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <VerifyEmailForm companyId={companyId} callbackUrl={callbackUrl} />
    </div>
  );
}
