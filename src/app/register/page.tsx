"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Page() {
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [birthYear, setBirthYear] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!birthYear) {
      toast.error("Vennligst oppgi fødselsår");
      return;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);

    if (age < 18) {
      toast.error("Du må være minst 18 år gammel for å bruke FLUS");
      return;
    }

    if (!acceptTerms) {
      toast.error("Du må godta vilkårene for å registrere deg");
      return;
    }

    setLoading(true);
    try {
      const vippsHref = `/api/auth/vipps/start?role=${role}&birthYear=${birthYear}`;
      window.location.href = vippsHref;
    } catch {
      toast.error("Noe gikk galt. Prøv igjen.");
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Registrer med Vipps</h1>
      <p className="text-gray-500 text-center mb-6">I denne demoen støtter vi kun registrering og innlogging via Vipps.</p>
      
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700">Velg din rolle:</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              style={{ borderColor: role === "worker" ? "#f97316" : "#e5e7eb" }}>
              <input
                type="radio"
                name="role"
                value="worker"
                checked={role === "worker"}
                onChange={(e) => setRole(e.target.value as "worker" | "employer")}
                className="w-4 h-4"
              />
              <div>
                <div className="font-semibold text-gray-900">👷 Jeg er jobbsøker</div>
                <div className="text-sm text-gray-600">Søk og utfør småjobber</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              style={{ borderColor: role === "employer" ? "#f97316" : "#e5e7eb" }}>
              <input
                type="radio"
                name="role"
                value="employer"
                checked={role === "employer"}
                onChange={(e) => setRole(e.target.value as "worker" | "employer")}
                className="w-4 h-4"
              />
              <div>
                <div className="font-semibold text-gray-900">💼 Jeg er arbeidsgiver</div>
                <div className="text-sm text-gray-600">Opprett og publiser jobber</div>
              </div>
            </label>
          </div>
        </div>

        {/* Age Verification */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Fødselsår * <span className="text-xs text-gray-500">(Du må være minst 18 år)</span>
          </label>
          <Input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="2005"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <div className="text-sm text-gray-700">
              Jeg godtar <a href="#" className="text-orange-600 hover:underline">vilkårene for bruk</a> og 
              <a href="#" className="text-orange-600 hover:underline ml-1">personvernerklæringen</a>
            </div>
          </label>
        </div>

        <Button 
          onClick={handleRegister} 
          disabled={loading}
          className="w-full h-11 text-base font-semibold"
        >
          {loading ? "Registrerer..." : `Fortsett med Vipps som ${role === "employer" ? "arbeidsgiver" : "jobbsøker"}`}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Demo: ved klikk opprettes/finnes en bruker med valgt rolle og økten settes.
        </p>
      </div>
    </div>
  );
}