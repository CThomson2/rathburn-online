"use client";

import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { paths } from "/config/paths";
import { useRegister, registerInputSchema } from "@/lib/auth";

/**
 * Props for the RegisterForm component
 * @property {Function} onSuccess - Callback function to execute after successful registration
 */
type RegisterFormProps = {
  onSuccess: () => void;
};

/**
 * Registration form component that handles user account creation
 *
 * This component provides a form for new users to register with:
 * - First and last name
 * - Email address
 * - Password (with confirmation)
 *
 * Features:
 * - Form validation using zod schema
 * - Password visibility toggle
 * - Redirect handling after successful registration
 * - Loading state during registration process
 *
 * @param {RegisterFormProps} props - Component props
 * @returns {JSX.Element} The registration form UI
 */
export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  // State for toggling password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Hook for handling registration API call
  const registering = useRegister({ onSuccess });

  // Get redirect URL from query parameters (if any)
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");

  /**
   * Toggles the visibility of the password field
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Toggles the visibility of the confirm password field
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-violet-800 mb-6 text-center">
        Create Account
      </h2>

      <Form
        onSubmit={(values) => {
          registering.mutate(values);
        }}
        schema={registerInputSchema}
        className="space-y-5"
      >
        {({ register, formState }) => (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Input
                  type="text"
                  label="First Name"
                  error={formState.errors["firstName"]}
                  registration={register("firstName")}
                  placeholder="Enter your first name"
                  className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Last Name"
                  error={formState.errors["lastName"]}
                  registration={register("lastName")}
                  placeholder="Enter your last name"
                  className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
                />
              </div>
            </div>

            <div className="mb-2">
              <Input
                type="email"
                label="Email Address"
                error={formState.errors["email"]}
                registration={register("email")}
                placeholder="your.email@example.com"
                className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
              />
            </div>

            <div className="relative mb-2">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                error={formState.errors["password"]}
                registration={register("password")}
                placeholder="Create a strong password"
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

            <div className="relative mb-6">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                error={formState.errors["confirmPassword"]}
                registration={register("confirmPassword")}
                placeholder="Confirm your password"
                className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-violet-600 hover:text-violet-800"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full h-14 text-lg bg-violet-600 hover:bg-violet-700 shadow-md"
                disabled={registering.isPending}
              >
                {registering.isPending ? "Registering..." : "Register Account"}
              </Button>
            </div>
          </>
        )}
      </Form>

      <div className="mt-6 text-center text-base text-violet-800 font-medium">
        <span>Already have an account? </span>
        <NextLink
          href={paths.auth.login.getHref(redirectTo)}
          className="font-bold text-violet-900 hover:text-violet-950 underline"
        >
          Log In
        </NextLink>
      </div>
    </div>
  );
};
