'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
    
    // Start fade out a bit before redirect
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // start fading at 2s

    const redirectTimer = setTimeout(() => {
      router.push('/auth/login');
    }, 2500); // redirect after 2.5s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  // Prevent hydration mismatch by not rendering dynamic content on server
  if (!isClient) {
    return (
      <main className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-amber-50 relative overflow-hidden">
        <div className="flex flex-col items-center space-y-8 z-10">
          <div className="relative">
            <Image
              src="/rgc.png"
              alt="Redeemed Gospel Church Logo"
              width={100}
              height={100}
              className="rounded-full shadow-2xl border-4 border-amber-300"
              priority
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-amber-50 relative overflow-hidden transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Logo with bounce animation */}
        <div className="animate-bounce-in">
          <div className="relative">
            <Image
              src="/rgc.png"
              alt="Redeemed Gospel Church Logo"
              width={100}
              height={100}
              className="rounded-full shadow-2xl border-4 border-amber-300"
              priority
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-amber-400 opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full gold-shimmer"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
