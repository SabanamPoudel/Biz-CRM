"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      // Redirect to signup page for new users
      router.push('/signup');
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#003174] mx-auto"></div>
        <p className="mt-4 text-[#003174] font-medium">Loading BizzCRM...</p>
      </div>
    </div>
  );
}
