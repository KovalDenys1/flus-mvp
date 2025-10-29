"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { googleMapsEmbedUrl } from "@/lib/utils/map";
import { minutesToHhMm } from "@/lib/utils/format";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job: {
    id: string; title: string; desc: string; category: string;
    payNok: number; durationMinutes: number; areaName: string; lat: number; lng: number;
  } | null;
  onApply?: (jobId: string) => void;
  hasApplied?: boolean;
};

export function JobDetailsDialog({ open, onOpenChange, job, onApply, hasApplied = false }: Props) {
  if (!job) return null;
  const mapSrc = googleMapsEmbedUrl(job.lat, job.lng, job.title);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{job.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{job.areaName} • {job.category}</p>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm leading-relaxed whitespace-pre-line">{job.desc}</p>
          <div className="text-sm">
            Lønn: <b>{job.payNok} NOK</b> • Varighet: {minutesToHhMm(job.durationMinutes)}
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <iframe
              src={mapSrc}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kart"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full mt-4">
          {onApply && (
            <button
              className={`w-1/2 px-4 py-2 rounded-lg text-sm font-medium shadow transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                hasApplied
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              onClick={() => onApply(job.id)}
              disabled={hasApplied}
            >
              {hasApplied ? "✓ Søknad sendt" : "Søk"}
            </button>
          )}
          <a
            href={`/jobber/${job.id}`}
            className="w-1/2 px-4 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium shadow hover:bg-orange-200 transition text-center flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            Åpne full side
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}