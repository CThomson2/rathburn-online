"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { paths } from "/config/paths";
import { LoginForm } from "@/features/auth/components/login-form";
import { AuthLayout } from "@/app/(auth)/_components/auth-layout";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");

  return (
    <AuthLayout>
      <LoginForm
        onSuccess={() =>
          router.replace(
            `${
              redirectTo
                ? `${decodeURIComponent(redirectTo)}`
                : paths.inventory.root.getHref()
            }`
          )
        }
      />
    </AuthLayout>
  );
};

export default LoginPage;
