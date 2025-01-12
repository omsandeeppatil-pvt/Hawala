import React from "react";
import { cn } from "@/utils/cn"; // Utility for conditional class merging

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
};

const BUTTON_BASE_STYLES =
  "inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-200",
  ghost: "bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-200",
};

const SIZE_STYLES: Record<NonNullable<ButtonProps["size"]>, string> = {
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  className,
  children,
  ...props
}) => {
  const buttonClasses = cn(
    BUTTON_BASE_STYLES,
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className
  );

  return (
    <button className={buttonClasses} disabled={loading} {...props}>
      {loading ? (
        <span
          className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
