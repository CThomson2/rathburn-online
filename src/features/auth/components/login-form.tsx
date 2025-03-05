"use client";

import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { paths } from "/config/paths";
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
      <h2 className="text-3xl font-bold text-violet-800 mb-6 text-center">
        Welcome Back
      </h2>

      {login.error && (
        <Alert variant="destructive" className="mb-6 border-red-300 bg-red-50">
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
        className="space-y-6"
      >
        {({ register, formState }) => (
          <>
            <div className="mb-6">
              <Input
                type="email"
                label="Email Address"
                error={formState.errors["email"]}
                registration={register("email")}
                placeholder="your.email@example.com"
                className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
              />
            </div>

            <div className="relative mb-8">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                error={formState.errors["password"]}
                registration={register("password")}
                placeholder="Enter your password"
                className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-violet-600 hover:text-violet-800"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full h-14 text-lg bg-violet-600 hover:bg-violet-700 shadow-md"
                disabled={login.isPending}
              >
                {login.isPending ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </>
        )}
      </Form>

      <div className="mt-6 text-center text-base text-violet-800 font-medium">
        <span>Don&apos;t have an account? </span>
        <NextLink
          href={paths.auth.register.getHref(redirectTo)}
          className="font-bold text-violet-900 hover:text-violet-950 underline"
        >
          Register
        </NextLink>
      </div>

      <div className="mt-3 text-center text-sm text-violet-700">
        <a href="#" className="hover:text-violet-900">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};
