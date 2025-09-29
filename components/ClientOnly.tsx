"use client";
import { useState, useEffect, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div />; // SSR me empty div render → layout safe
  return <>{children}</>;
}
