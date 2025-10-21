"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function StatistikkPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Statistikk</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="py-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Publiserte jobber</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Aktive søkere</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Fullførte jobber</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Statistikk kommer snart</h3>
          <p className="text-gray-600">
            Her vil du kunne se detaljert statistikk om dine jobber og ansettelser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
