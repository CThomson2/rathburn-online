"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@config/paths";

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
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // This is a placeholder validation - replace with your actual validation logic
  const validateSecurityCode = (code: string) => {
    // Example: code should be "0-9-X"
    // In production, you'd want to use a more secure verification method
    return code === "0-9-1";
  };

  const formatCode = (code: string) => {
    // Format the input into X-X-X pattern
    const digits = code.replace(/-/g, "").slice(0, 3).split("");
    return digits.join("-");
  };

  const handleKeypadClick = (digit: string) => {
    const currentDigits = securityCode.replace(/-/g, "").split("");

    if (currentDigits.length < 3) {
      const newDigits = [...currentDigits, digit];
      const newCode = formatCode(newDigits.join(""));
      setSecurityCode(newCode);
      setCursorPosition(newCode.length);

      // Focus the input after clicking a button
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and X character
    const value = e.target.value.replace(/-/g, "");
    const filtered = value.replace(/[^0-9X]/gi, "").slice(0, 3);
    const formatted = formatCode(filtered);

    setSecurityCode(formatted);
    setError("");

    // Update cursor position
    setCursorPosition(formatted.length);
  };

  // Position cursor properly when input changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = cursorPosition;
      inputRef.current.selectionEnd = cursorPosition;
    }
  }, [cursorPosition, securityCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateSecurityCode(securityCode)) {
      setIsLoading(true);
      // Keep the modal open but show loading state
      setTimeout(() => {
        setIsOpen(false);
        router.push(paths.inventory.root.getHref());
      }, 500); // Small delay to ensure the loading state is visible
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

  // Generate keypad buttons
  const renderKeypad = () => {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "X"];

    return (
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto mt-6">
        {digits.map((digit) => (
          <Button
            key={digit}
            type="button"
            onClick={() => handleKeypadClick(digit)}
            className={`h-12 w-12 text-xl font-medium ${
              digit === "X" ? "col-span-3" : ""
            }`}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" className="mr-2" /> : digit}
          </Button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Security Check
          </h2>
          {/* Optional close button if needed */}
          <button onClick={() => setIsOpen(false)} disabled={isLoading}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="text-center">
              <label
                htmlFor="securityCode"
                className="mb-3 block text-base font-medium text-gray-700"
              >
                Enter Gate Security Code
              </label>
              <Input
                id="securityCode"
                ref={inputRef}
                placeholder="X-X-X"
                value={securityCode}
                onChange={handleInputChange}
                className="w-32 mx-auto text-center text-2xl font-medium text-black placeholder:text-gray-400"
                autoFocus
                maxLength={5}
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            {renderKeypad()}

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 w-full max-w-[180px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    Redirecting...
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
