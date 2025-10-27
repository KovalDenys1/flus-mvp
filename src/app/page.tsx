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
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 px-6 py-2 text-sm font-semibold shadow-lg">
              🚀 FLUS - Din lokale jobbplattform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Finn <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">småjobber</span>
              <br />
              i ditt nærområde
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Tusenvis av lokale småjobber venter. Tjen penger fleksibelt eller få hjelp med oppgaver hjemme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all rounded-2xl">
                  Kom i gang gratis →
                </Button>
              </Link>
              <Link href="/jobber">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 px-10 py-7 text-lg font-semibold rounded-2xl transition-all">
                  Se alle jobber
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Aktive jobber</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-sm text-gray-600">Registrerte brukere</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
                <div className="text-sm text-gray-600">Gjennomsnittsvurdering</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hvordan det fungerer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tre enkle steg til din neste småjobb
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Søk</h3>
              <p className="text-gray-600 leading-relaxed">
                Finn småjobber i ditt område basert på dine ferdigheter og interesser
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Koble sammen</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat direkte med arbeidsgivere og bli enige om detaljer
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Få betalt</h3>
              <p className="text-gray-600 leading-relaxed">
                Fullfør jobben og motta betaling umiddelbart
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Workers */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-white rounded-3xl overflow-hidden group">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-5xl">👷</span>
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  For jobbsøkere
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-orange-200 transition">
                      <span className="text-orange-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Finn småjobber i ditt nærområde</span>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-orange-200 transition">
                      <span className="text-orange-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Søk enkelt med ett klikk</span>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-orange-200 transition">
                      <span className="text-orange-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Chat direkte med arbeidsgivere</span>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-orange-200 transition">
                      <span className="text-orange-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Få betalt umiddelbart etter jobb</span>
                  </div>
                </div>
                <Link href="/register" className="block mt-8">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    Bli jobbsøker →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white rounded-3xl overflow-hidden group">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-5xl">💼</span>
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  For arbeidsgivere
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-blue-200 transition">
                      <span className="text-blue-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Opprett jobber på få minutter</span>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-blue-200 transition">
                      <span className="text-blue-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Få søknader fra kvalifiserte kandidater</span>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-blue-200 transition">
                      <span className="text-blue-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Chat og følg opp arbeidet</span>
                  </div>
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-blue-200 transition">
                      <span className="text-blue-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg">Trygg betaling og kvalitetsgaranti</span>
                  </div>
                </div>
                <Link href="/register" className="block mt-8">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    Bli arbeidsgiver →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Populære kategorier
            </h2>
            <p className="text-lg text-gray-600">
              Finn småjobber som passer deg
            </p>
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
              <div key={category.name} className="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                <div className="font-bold text-gray-900 text-lg mb-1">{category.name}</div>
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