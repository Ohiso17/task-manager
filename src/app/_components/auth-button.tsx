"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
    >
      Sign Out
    </button>
  );
}
