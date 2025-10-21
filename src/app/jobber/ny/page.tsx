"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Hagearbeid",
    payNok: "",
    durationMinutes: "",
    areaName: "Oslo",
    address: "",
    scheduleType: "flexible",
    startTime: "",
    endTime: "",
    paymentType: "fixed",
    requirements: "",
  });

  const categories = [
    "Hagearbeid",
    "IT-hjelp",
    "Snømåking",
    "Vask og vedlikehold",
    "Dyrepass",
    "Ærend",
    "Småflytting",
    "Leksehjelp",
    "Rydding",
    "Montering",
    "Dugnad",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.payNok || !form.durationMinutes) {
      toast.error("Vennligst fyll ut alle obligatoriske felt");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          payNok: parseInt(form.payNok),
          durationMinutes: parseInt(form.durationMinutes),
          areaName: form.areaName,
          address: form.address || null,
          scheduleType: form.scheduleType,
          startTime: form.startTime || null,
          endTime: form.endTime || null,
          paymentType: form.paymentType,
          requirements: form.requirements || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunne ikke opprette jobb");

      toast.success("Jobb opprettet!");
      router.push("/jobber");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Opprett ny jobb</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Grunnleggende informasjon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tittel *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="F.eks. Gressklipping"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Beskrivelse *</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Beskriv jobben..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Område *</label>
                <Input
                  value={form.areaName}
                  onChange={(e) => setForm({ ...form, areaName: e.target.value })}
                  placeholder="Oslo"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>📍 Sted</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="F.eks. Sofies gate 15, 0170 Oslo"
              />
              <p className="text-xs text-gray-500 mt-1">Full adresse eller firma-navn</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Duration */}
        <Card>
          <CardHeader>
            <CardTitle>💰 Betaling og varighet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Betalingstype *</label>
                <select
                  value={form.paymentType}
                  onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="fixed">Fast pris</option>
                  <option value="hourly">Timepris</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Betaling (NOK) * {form.paymentType === "hourly" && "/time"}
                </label>
                <Input
                  type="number"
                  value={form.payNok}
                  onChange={(e) => setForm({ ...form, payNok: e.target.value })}
                  placeholder="300"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estimert varighet (minutter) *</label>
              <Input
                type="number"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                placeholder="90"
                min="1"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Type */}
        <Card>
          <CardHeader>
            <CardTitle>⏰ Tidspunkt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Velg type tidspunkt *</label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="flexible"
                    checked={form.scheduleType === "flexible"}
                    onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">🕐 Fleksibel</div>
                    <div className="text-sm text-gray-600">
                      Start når som helst og bruk så lang tid du vil
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="deadline"
                    checked={form.scheduleType === "deadline"}
                    onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">📅 Frist</div>
                    <div className="text-sm text-gray-600">
                      Du kan begynne når som helst, men vær ferdig innen angitt tid
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="fixed"
                    checked={form.scheduleType === "fixed"}
                    onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">⏰ Fast tid</div>
                    <div className="text-sm text-gray-600">
                      Jobben må gjøres i et bestemt tidsrom (f.eks. 12:00-14:00)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {form.scheduleType === "fixed" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start tid *</label>
                  <Input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slutt tid *</label>
                  <Input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {form.scheduleType === "deadline" && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Frist *</label>
                <Input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Krav og instruksjoner</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              placeholder="F.eks. 'Ta med egne hansker' eller 'Må ha erfaring med Excel'"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Avbryt
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Oppretter..." : "Opprett jobb"}
          </Button>
        </div>
      </form>
    </div>
  );
}
