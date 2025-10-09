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
};

export function JobDetailsDialog({ open, onOpenChange, job, onApply }: Props) {
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

        <div className="flex justify-end gap-2">
          <button className="text-sm underline" onClick={() => onOpenChange(false)}>Lukk</button>
          {onApply && (
            <button className="text-sm underline" onClick={() => onApply(job.id)}>
              Søk
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}