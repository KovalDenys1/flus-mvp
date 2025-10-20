"use client";

import { Button } from "@/components/ui/button";

export default function Page() {
  const vippsHref = "/api/auth/vipps/start";
  return (
    <div className="max-w-sm mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Registrer med Vipps</h1>
      <p className="text-gray-500 text-center mb-6">I denne demoen støtter vi kun registrering og innlogging via Vipps.</p>
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <a href={vippsHref}>
          <Button className="w-full h-11 text-base font-semibold">Fortsett med Vipps</Button>
        </a>
        <p className="text-xs text-gray-500 text-center">Demo: ved klikk opprettes/finnes en bruker og økten settes.</p>
      </div>
    </div>
  );
}