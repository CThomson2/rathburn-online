"use client";

import { Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { useDashboard } from "../context/dashboard-context";

/**
 * Props for the BaseWidget component.
 * @property {string} id - Unique identifier for the widget.
 * @property {string} title - Title of the widget.
 * @property {string} [className] - Optional additional class names for styling.
 * @property {React.ReactNode} children - Child components or elements to be rendered inside the widget.
 */
interface BaseWidgetProps {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * BaseWidget component provides a styled container with a title and optional favorite toggle functionality.
 *
 * @param {BaseWidgetProps} props - The properties for the BaseWidget component.
 * @returns {JSX.Element} The rendered BaseWidget component.
 */
export function BaseWidget({
  id,
  title,
  className,
  children,
}: BaseWidgetProps): JSX.Element {
  const { toggleFavorite, isFavorited } = useDashboard();
  const favorited = isFavorited(id);

  return (
    <div
      className={cn(
        // Base styles
        "rounded-lg border bg-card text-card-foreground",
        // Light mode styles
        "bg-gradient-to-b from-white to-gray-50/80",
        "border-gray-200/50",
        // Dark mode styles
        "dark:from-slate-950/50 dark:to-slate-950/80",
        "dark:border-slate-800/50",
        // Shadow and glass effect
        "shadow-[0_8px_30px_rgb(0,0,0,0.07)]",
        "backdrop-blur-[2px]",
        // Hover effects
        "hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        "dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
        "hover:border-gray-300/50 dark:hover:border-slate-700/50",
        // Animation
        "transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between p-4 pb-2",
          "bg-gradient-to-b from-gray-50/50 to-transparent",
          "dark:from-slate-900/50 dark:to-transparent"
        )}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => toggleFavorite(id)}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Star
            className={cn("h-5 w-5", favorited && "fill-current text-primary")}
          />
          <span className="sr-only">
            {favorited ? "Remove from favorites" : "Add to favorites"}
          </span>
        </button>
      </div>
      <div className="p-4 pt-0">{children}</div>
    </div>
  );
}
