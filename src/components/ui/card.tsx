import React, { PropsWithChildren } from "react";

export function Card({ className = "", children }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-lg border bg-white shadow ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: PropsWithChildren<{ className?: string }>) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export default Card;


