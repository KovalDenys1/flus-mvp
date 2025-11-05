"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/AuthGuard";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    payNok: "",
    durationMinutes: "",
    areaName: "",
    address: "",
    postalCode: "",
    lat: null as number | null,
    lng: null as number | null,
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

  const calculateProgress = () => {
    const requiredFields = [form.title, form.description, form.category, form.payNok, form.durationMinutes];
    const filledRequired = requiredFields.filter(field => field && field.toString().trim()).length;
    return Math.round((filledRequired / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  const areas = [
    "Oslo",
    "Oslo - Sentrum",
    "Oslo - Øst",
    "Oslo - Vest",
    "Oslo - Nord",
    "Oslo - Sør",
    "Bergen",
    "Trondheim",
    "Stavanger",
    "Kristiansand",
    "Tromsø",
    "Bodø",
    "Ålesund",
    "Tønsberg",
    "Moss",
    "Sandefjord",
    "Arendal",
    "Haugesund",
    "Molde",
    "Kristiansund",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.description.trim() || !form.category) {
      toast.error("Vennligst fyll ut alle påkrevde felt");
      return;
    }

    const payNok = parseInt(form.payNok);
    const durationMinutes = parseInt(form.durationMinutes);

    if (isNaN(payNok) || payNok < 50) {
      toast.error("Betaling må være minst 50 kr");
      return;
    }

    if (isNaN(durationMinutes) || durationMinutes < 15) {
      toast.error("Varighet må være minst 15 minutter");
      return;
    }

    // Combine address with postal code
    const fullAddress = form.address.trim()
      ? `${form.address.trim()}${form.postalCode ? `, ${form.postalCode} ${form.areaName}` : ''}`
      : '';

    setLoading(true);
    try {
      // Upload photos first if any
      const photoUrls: string[] = [];
      if (photos.length > 0) {
        setUploadingPhotos(true);
        for (const photo of photos) {
          const formData = new FormData();
          formData.append("photo", photo);
          const uploadRes = await fetch("/api/upload/photo", {
            method: "POST",
            body: formData,
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            photoUrls.push(uploadData.photoUrl);
          } else {
            console.error("Failed to upload photo:", photo.name);
          }
        }
        setUploadingPhotos(false);
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          payNok,
          durationMinutes,
          areaName: form.areaName,
          address: fullAddress || null,
          lat: form.lat,
          lng: form.lng,
          scheduleType: form.scheduleType,
          startTime: form.startTime || null,
          endTime: form.endTime || null,
          paymentType: form.paymentType,
          requirements: form.requirements.trim() || null,
          initialPhotos: photoUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunne ikke opprette jobb");

      toast.success("Jobb opprettet!");
      // Set flag to refresh employer profile stats on next visit
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('refreshEmployerStats', 'true');
      }
      // Redirect to the newly created job's detail page
      if (data.job?.id) {
        router.push(`/jobber/${data.job.id}`);
      } else {
        router.push("/mine-jobber");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setLoading(false);
      setUploadingPhotos(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      {/* Progress Bar - Sticky below navbar */}
      <div className="sticky top-16 bg-white z-40 border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Fremgang</span>
            <span>{progress}% fullført</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Opprett ny jobb</h1>
          <p className="text-gray-600 mt-1">Fyll ut skjemaet nedenfor for å opprette en ny jobbannonse</p>
        </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori *</label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Område {form.areaName ? "(automatisk fylt)" : ""}</label>
                  <Select 
                    value={form.areaName} 
                    onValueChange={(value) => setForm({ ...form, areaName: value })}
                    disabled={!!form.address} // Disable if address was selected (area auto-filled)
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Velg område eller la oss finne det automatisk" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!form.areaName && <p className="text-xs text-gray-500 mt-1">Område fylles automatisk når du velger adresse</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>📍 Sted</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <p className="text-sm text-secondary">
                  💡 <strong>Tips:</strong> Bare skriv inn adressen din (f.eks. Furuset alle 19B). 
                  Vi finner automatisk riktig område for deg!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <AddressAutocomplete
                    value={form.address}
                    onChange={(value) => setForm({ ...form, address: value })}
                    placeholder="F.eks. Karl Johans gate 22, Furuset alle 19B"
                    onSelect={(address, lat, lng, area) => {
                      setForm({ 
                        ...form, 
                        address, 
                        lat: lat || null, 
                        lng: lng || null,
                        areaName: area || form.areaName // Auto-fill area if detected
                      });
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Gatenavn og husnummer</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Postnummer</label>
                  <Input
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="0170"
                    maxLength={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">4 siffer, f.eks. 0170</p>
                </div>
              </div>

              {form.address && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm text-primary">
                    ✅ <strong>Valgt adresse:</strong> {form.address}
                    {form.postalCode && `, ${form.postalCode} ${form.areaName}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment & Duration */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Betaling og varighet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Betalingstype *</label>
                  <Select value={form.paymentType} onValueChange={(value) => setForm({ ...form, paymentType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fast pris</SelectItem>
                      <SelectItem value="hourly">Timepris</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>📸 Jobb bilder (valgfritt)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <p className="text-sm text-secondary">
                  💡 <strong>Tips:</strong> Legg til bilder av jobben for å gjøre annonsen mer attraktiv.
                  Arbeidstakere kan se bildene før de søker.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last opp bilder</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setPhotos(files);
                  }}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/5"
                />
                {photos.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {photos.length} bilde{photos.length > 1 ? 'r' : ''} valgt
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Avbryt
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" disabled={progress < 50}>
                  👁️ Forhåndsvisning
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Forhåndsvisning av jobb</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{form.title || "Jobbtittel"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{form.category || "Kategori"}</Badge>
                      <span className="text-sm text-gray-500">📍 {form.areaName || "Område"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Beskrivelse</h4>
                    <p className="text-gray-700">{form.description || "Ingen beskrivelse enda..."}</p>
                  </div>

                  {form.address && (
                    <div>
                      <h4 className="font-semibold mb-2">📍 Adresse</h4>
                      <p className="text-gray-700">
                        {form.address}
                        {form.postalCode && `, ${form.postalCode} ${form.areaName}`}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">💰 Betaling</h4>
                      <p className="text-2xl font-bold text-primary">
                        {form.payNok ? `${form.payNok} kr` : "0 kr"}
                        {form.paymentType === "hourly" && "/time"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">⏱️ Varighet</h4>
                      <p className="text-lg">{form.durationMinutes ? `${form.durationMinutes} min` : "0 min"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📋 Krav og instruksjoner</h4>
                    <p className="text-gray-700">{form.requirements || "Ingen spesielle krav"}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button type="submit" disabled={loading || uploadingPhotos || progress < 100} className="flex-1 bg-primary hover:bg-primary">
              {uploadingPhotos ? "Laster opp bilder..." : loading ? "Oppretter..." : "Opprett jobb"}
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
