"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  title: string;
  submitButtonText: string;
  revieweeName: string;
}

export default function ReviewDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitButtonText,
  revieweeName
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Vennligst velg en vurdering");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      toast.success("Vurdering sendt!");
      handleClose();
    } catch (error) {
      toast.error("Kunne ikke sende vurdering");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">
              Hvordan var samarbeidet med {revieweeName}?
            </Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-secondary fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {rating === 0 ? "Velg vurdering" :
               rating === 1 ? "Svært dårlig" :
               rating === 2 ? "Dårlig" :
               rating === 3 ? "Ok" :
               rating === 4 ? "Bra" :
               "Utmerket"}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Kommentar (valgfritt)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Del din erfaring med andre brukere..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Sender..." : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}