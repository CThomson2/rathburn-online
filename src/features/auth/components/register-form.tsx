"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

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

// Password validation criteria based on schema
type PasswordValidation = {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  match: boolean;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState<PasswordValidation>({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    match: false,
  });

  // Hook for handling registration API call
  const registering = useRegister({ onSuccess });

  // Get redirect URL from query parameters (if any)
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");

  // Update password validation status whenever password changes
  useEffect(() => {
    setValidation({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      match: password === confirmPassword && password.length > 0,
    });
  }, [password, confirmPassword]);

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

  /**
   * Update local state when password field changes
   */
  const trackPasswordChange = (value: string) => {
    setPassword(value);
  };

  /**
   * Update local state when confirm password field changes
   */
  const trackConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
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
                onChange={(e) => trackPasswordChange(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-violet-600 hover:text-violet-800"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {/* Password validation checklist */}
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  {validation.length ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span
                    className={
                      validation.length ? "text-green-700" : "text-red-700"
                    }
                  >
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {validation.uppercase ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span
                    className={
                      validation.uppercase ? "text-green-700" : "text-red-700"
                    }
                  >
                    At least one uppercase letter
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {validation.lowercase ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span
                    className={
                      validation.lowercase ? "text-green-700" : "text-red-700"
                    }
                  >
                    At least one lowercase letter
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {validation.number ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span
                    className={
                      validation.number ? "text-green-700" : "text-red-700"
                    }
                  >
                    At least one number
                  </span>
                </li>
              </ul>
            </div>

            <div className="relative mb-6">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                error={formState.errors["confirmPassword"]}
                registration={register("confirmPassword")}
                placeholder="Confirm your password"
                className="bg-white/90 h-14 text-lg rounded-lg border-violet-200 focus:border-violet-400 shadow-sm"
                onChange={(e) => trackConfirmPasswordChange(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-violet-600 hover:text-violet-800"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {/* Password match validation */}
              {(password.length > 0 || confirmPassword.length > 0) && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {validation.match ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-green-700">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-red-500" />
                      <span className="text-red-700">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
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
