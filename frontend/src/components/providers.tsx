"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";

// We separate this into a Client Component so our main layout.tsx can remain a Server Component
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}