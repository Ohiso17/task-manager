"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginForm } from "~/app/_components/login-form";
import { SignupForm } from "~/app/_components/signup-form";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="text-xl text-white">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-blue-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white/10 p-8 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome to Task Manager
          </h1>
          <p className="mt-2 text-white/70">
            {isLogin
              ? "Sign in to manage your tasks"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Toggle between login and signup */}
        <div className="flex rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isLogin
                ? "bg-blue-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              !isLogin
                ? "bg-blue-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? <LoginForm /> : <SignupForm />}

        {isLogin && (
          <div className="text-center">
            <p className="text-sm text-white/60">
              Demo credentials: test@example.com / password123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
