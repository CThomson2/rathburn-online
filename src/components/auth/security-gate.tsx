"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paths } from "../../../config/paths";

/**
 * SecurityGate component
 *
 * Renders a modal prompt for security code entry before allowing access to auth pages.
 * On correct code entry, redirects to home page.
 */
export function SecurityGate() {
  const [isOpen, setIsOpen] = useState(true);
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // This is a placeholder validation - replace with your actual validation logic
  const validateSecurityCode = (code: string) => {
    // Example: code should be "1-2-3"
    // In production, you'd want to use a more secure verification method
    return code === "0-9-1";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateSecurityCode(securityCode)) {
      setIsOpen(false);
      router.push(paths.inventory.root.getHref());
    } else {
      setError("Invalid security code. Please try again.");
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Security Check
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="securityCode"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Enter Gate Security Code
              </label>
              <div className="relative flex items-center">
                <Input
                  id="securityCode"
                  value={securityCode}
                  onChange={(e) => {
                    // Only allow digits and limit to 3 characters
                    const input = e.target.value.replace(/[^0-9]/g, "");
                    if (input.length <= 3) {
                      // Format as X-X-X where X is the digit or X if not entered yet
                      const formattedCode = Array(3)
                        .fill("X")
                        .map((char, i) => input[i] || char)
                        .join("-");
                      setSecurityCode(formattedCode);
                      setError("");
                    }
                  }}
                  className="w-full text-center"
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]-[0-9]-[0-9]"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="opacity-0">{securityCode}</span>
                </div>
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
