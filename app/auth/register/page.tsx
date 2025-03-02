"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { paths } from "@/config/paths";
import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthLayout } from "@/app/auth/_components/auth-layout";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");

  return (
    <AuthLayout>
      <RegisterForm
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

export default RegisterPage;
