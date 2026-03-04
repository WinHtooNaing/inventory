"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "BRANCH") {
        router.push("/branch/sale");
      }
    }
  }, [user, router]);

  if (user) return null;

  return <>{children}</>;
}
