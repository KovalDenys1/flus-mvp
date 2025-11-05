"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { toast } from "sonner";

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
  updated_at?: string;
};

const FAQ_ITEMS = [
  {
    question: "Hvordan søker jeg på jobber?",
    answer: "Klikk på en jobb som interesserer deg og trykk 'Søk'. Du vil da starte en samtale med arbeidsgiveren."
  },
  {
    question: "Hvordan oppretter jeg en jobbannonse?",
    answer: "Gå til 'Opprett jobb' og fyll ut skjemaet med jobbdetaljer. Jobben blir publisert umiddelbart."
  },
  {
    question: "Hvordan fungerer betaling?",
    answer: "Arbeidsgivere betaler via Vipps eller bankoverføring. Arbeidstakere mottar betaling etter fullført arbeid."
  },
  {
    question: "Hva gjør jeg hvis jeg har problemer med en jobb?",
    answer: "Kontakt arbeidsgiveren direkte via samtalen, eller opprett en support-ticket hvis problemet vedvarer."
  },
  {
    question: "Hvordan redigerer jeg min profil?",
    answer: "Gå til 'Min profil' for å oppdatere din informasjon, CV og ferdigheter."
  }
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await fetch("/api/support/tickets");
      if (!res.ok) {
        throw new Error("Kunne ikke laste support-tickets");
      }
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Feil ved lasting av support-tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Vennligst fyll ut alle feltene");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          category,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Kunne ikke sende forespørsel");
      }

      toast.success("Support-forespørsel sendt!");
      setFormOpen(false);
      setSubject("");
      setMessage("");
      setCategory("general");
      loadTickets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunne ikke sende forespørsel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-primary" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-secondary" />;
      case "closed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Åpen";
      case "in_progress":
        return "Under behandling";
      case "closed":
        return "Lukket";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-primary/10 text-primary";
      case "in_progress":
        return "bg-secondary/10 text-secondary";
      case "closed":
        return "bg-primary/10 text-primary";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support</h1>
            <p className="text-gray-600 mt-1">Få hjelp og støtte</p>
          </div>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ny forespørsel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Kontakt support</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Emne</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Kort beskrivelse av problemet"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Generelt</SelectItem>
                      <SelectItem value="technical">Teknisk problem</SelectItem>
                      <SelectItem value="payment">Betaling</SelectItem>
                      <SelectItem value="account">Konto</SelectItem>
                      <SelectItem value="job">Jobb-relatert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Melding</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Beskriv problemet ditt i detalj..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Sender..." : "Send forespørsel"}
                  {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Ofte stilte spørsmål
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <details key={index} className="border rounded-lg p-4">
                  <summary className="font-medium cursor-pointer hover:text-primary">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Mine support-forespørsler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen support-forespørsler</h3>
                <p className="text-gray-600 mb-4">
                  Du har ikke sendt noen support-forespørsler ennå.
                </p>
                <Button onClick={() => setFormOpen(true)} variant="outline">
                  Send din første forespørsel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusText(ticket.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                        <div className="text-xs text-gray-500">
                          Opprettet {new Date(ticket.created_at).toLocaleDateString('no-NO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gradient-to-r from-secondary/10 to-purple-50 border-0">
          <CardContent className="py-8 text-center">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-xl font-semibold mb-2">Trenger du mer hjelp?</h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Vårt support-team er her for å hjelpe deg. Du kan også kontakte oss direkte på
              support@flus.no eller ringe oss på +47 123 45 678.
            </p>
            <div className="text-sm text-gray-500">
              <p>Support-tider: Mandag - Fredag, 09:00 - 17:00</p>
              <p>Svar-tid: Innen 24 timer på hverdager</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}