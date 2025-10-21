"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Logg inn med Vipps</h1>
      <p className="text-gray-500 text-center mb-6">Bruk Vipps-appen for å logge inn sikkert.</p>
      
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="text-center text-sm text-gray-600">
          Etter innlogging kan du veksle mellom å søke jobber og opprette jobber.
        </div>

        <a href="/api/auth/vipps/start">
          <Button className="w-full h-11 text-base font-semibold">
            Logg inn med Vipps
          </Button>
        </a>
        
        <p className="text-xs text-gray-500 text-center">
          Du blir omdirigert til Vipps for sikker autentisering.
        </p>
      </div>
    </div>
  );
}