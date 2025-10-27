"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type User = { id: string; email: string; role: "worker" | "employer" } | null;

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      // User is logged in - redirect to appropriate mode
      const savedMode = localStorage.getItem("viewMode");
      if (savedMode === "employer") {
        router.push("/mine-jobber");
      } else {
        router.push("/jobber");
      }
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 px-4 py-1">
              🚀 FLUS MVP - Finn lokale jobber enkelt
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Koble sammen
              <span className="text-orange-600 block">lokale jobber</span>
              <span className="text-blue-600">og dyktige folk</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              FLUS gjør det enkelt å finne småjobber i ditt område eller tilby dine tjenester.
              Alt skjer lokalt, trygt og effektivt.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                  Kom i gang gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-orange-300 px-8 py-3 text-lg">
                  Logg inn
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hvordan det fungerer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enkel plattform for lokale jobber - enten du trenger hjelp eller vil hjelpe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* For Workers */}
            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👷</span>
                </div>
                <CardTitle className="text-2xl text-orange-600">For jobbsøkere</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Finn småjobber i ditt område</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Søk enkelt med ett klikk</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Chat direkte med arbeidsgivere</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>Få betalt umiddelbart etter jobb</span>
                  </div>
                </div>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Bli jobbsøker
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <CardTitle className="text-2xl text-blue-600">For arbeidsgivere</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Opprett jobber på få minutter</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Få søknader fra kvalifiserte kandidater</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Chat og følg opp arbeidet</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Trygg betaling og kvalitetsgaranti</span>
                  </div>
                </div>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Bli arbeidsgiver
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Populære kategorier
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Hagearbeid", icon: "🌱", count: "150+" },
              { name: "IT-hjelp", icon: "💻", count: "80+" },
              { name: "Flytting", icon: "📦", count: "60+" },
              { name: "Vask", icon: "🧽", count: "90+" },
              { name: "Snømåking", icon: "❄️", count: "40+" },
              { name: "Dyrepass", icon: "🐕", count: "70+" },
              { name: "Leksehjelp", icon: "📚", count: "30+" },
              { name: "Montering", icon: "🔧", count: "50+" },
            ].map((category) => (
              <div key={category.name} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count} jobber</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klar til å komme i gang?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Registrer deg gratis og finn din neste jobb eller hjelper i dag.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Registrer deg nå
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">FLUS</div>
              <p className="text-gray-400">
                Kobler sammen lokale jobber og dyktige folk.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For jobbsøkere</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobber" className="hover:text-white">Finn jobber</Link></li>
                <li><Link href="/prestasjoner" className="hover:text-white">Prestasjoner</Link></li>
                <li><Link href="/profil" className="hover:text-white">Min profil</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For arbeidsgivere</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobber/ny" className="hover:text-white">Opprett jobb</Link></li>
                <li><Link href="/mine-jobber" className="hover:text-white">Mine jobber</Link></li>
                <li><Link href="/statistikk" className="hover:text-white">Statistikk</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/grunder" className="hover:text-white">Grunnleggende</Link></li>
                <li><Link href="/support" className="hover:text-white">Kontakt oss</Link></li>
                <li><Link href="/login" className="hover:text-white">Logg inn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FLUS. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}