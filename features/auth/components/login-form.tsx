"use client";

import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { paths } from "@/config/paths";
import { useLogin, loginInputSchema } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const login = useLogin({
    onSuccess,
  });

  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      {login.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {login.error instanceof Error
              ? login.error.message
              : "Invalid email or password. Please try again or register for a new account."}
          </AlertDescription>
        </Alert>
      )}

      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              type="email"
              label="Email Address"
              error={formState.errors["email"]}
              registration={register("email")}
              placeholder="your.email@example.com"
            />

            <div className="relative mt-4">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                error={formState.errors["password"]}
                registration={register("password")}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={login.isPending}
              >
                {login.isPending ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </>
        )}
      </Form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <span>Don&apos;t have an account? </span>
        <NextLink
          href={paths.auth.register.getHref(redirectTo)}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Register
        </NextLink>
      </div>

      <div className="mt-2 text-center text-xs text-gray-500">
        <a href="#" className="hover:text-gray-700">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};
