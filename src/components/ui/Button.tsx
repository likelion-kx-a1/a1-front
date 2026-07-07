import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "text";
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  // 공통 기본 스타일
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors outline-none";

  // 비활성 시 disabled 스타일 사용
  const appliedVariant = disabled ? "disabled" : variant;

  const variantStyle = {
    primary: "cursor-pointer bg-primary-500 text-white hover:bg-primary-600",
    outline: "cursor-pointer border border-gray-600 text-white hover:bg-gray-900",
    text: "cursor-pointer font-medium text-primary-300 hover:underline",
    disabled: "cursor-not-allowed bg-gray-700 text-gray-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(baseStyles, variantStyle[appliedVariant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
