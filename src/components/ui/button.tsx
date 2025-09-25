import React, { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" };

export default function Button({ variant = "default", className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-red-600 text-red-600 hover:bg-red-50",
  } as const;
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}


