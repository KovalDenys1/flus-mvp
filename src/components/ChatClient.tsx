"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from '@supabase/supabase-js'
import { Message } from "@/lib/chat-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Camera, CheckCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
  status: "open" | "assigned" | "completed" | "cancelled";
  selectedWorkerId?: string;
  employerId: string;
};

type Conversation = {
  id: string;
  job_id: string;
  worker_id: string;
  employer_id: string;
  created_at: string;
};

export default function ChatClient({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [beforePhotoPreview, setBeforePhotoPreview] = useState<string | null>(null);
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string | null>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completingWork, setCompletingWork] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUserId(data.user.id);
          // Initialize authenticated Supabase client for realtime
          const authSupabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
              persistSession: false
            }
          });
          setSupabaseClient(authSupabase);
        } else {
          setError("Du må være logget inn for å se denne samtalen.");
        }
      });
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    async function fetchData() {
      try {
        const [messagesRes, convRes] = await Promise.all([
          fetch(`/api/conversations/${conversationId}/messages`),
          fetch(`/api/conversations`),
        ]);
        
        if (!messagesRes.ok) throw new Error(`Kunne ikke hente meldinger: ${messagesRes.status}`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
        
        if (convRes.ok) {
          const convData = await convRes.json();
          const currentConv = (convData.conversations || []).find((c: Conversation) => c.id === conversationId);
          if (currentConv) {
            setConversation(currentConv);
            const jobRes = await fetch(`/api/jobs/${currentConv.job_id}`);
            if (jobRes.ok) {
              const jobData = await jobRes.json();
              setJob(jobData.job || null);
            }
          }
        }
      } catch {
        setError("En ukjent feil oppstod.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [conversationId, currentUserId]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!conversationId || !supabaseClient) return;

    const channel = supabaseClient
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            // Check if message is already in the list
            if (prev.some(msg => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage].sort((a, b) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [conversationId, supabaseClient]);

  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessage }),
      });
      if (!res.ok) throw new Error("Kunne ikke sende melding");
      // Don't add message to state here - realtime will handle it
      setNewMessage("");
    } catch {
      toast.error("Kunne ikke sende melding.");
    } finally {
      setSending(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (uploadingPhoto) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const uploadRes = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Kunne ikke laste opp bilde");
      }

      const uploadData = await uploadRes.json();

      // Send photo message
      const messageRes = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUrl: uploadData.photoUrl,
          caption: "Bilde fra arbeid"
        }),
      });

      if (!messageRes.ok) {
        throw new Error("Kunne ikke sende bilde");
      }

      // Don't add message to state here - realtime will handle it
      toast.success("Bilde sendt!");
    } catch (error) {
      console.error("Feil ved opplasting av bilde:", error);
      toast.error("Kunne ikke sende bilde");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
    // Reset input
    e.target.value = "";
  };

  const handleCompleteWork = async () => {
    // Open completion dialog
    setShowCompletionDialog(true);
  };

  const handleSubmitCompletion = async () => {
    if (!beforePhoto || !afterPhoto) {
      toast.error("Du må laste opp bilder før og etter arbeidet");
      return;
    }

    setCompletingWork(true);
    try {
      // Upload before photo
      const beforeFormData = new FormData();
      const beforeBlob = await fetch(beforePhotoPreview!).then(r => r.blob());
      beforeFormData.append("photo", beforeBlob, "before.jpg");

      const beforeUploadRes = await fetch("/api/upload/photo", {
        method: "POST",
        body: beforeFormData,
      });

      if (!beforeUploadRes.ok) {
        throw new Error("Kunne ikke laste opp 'før' bilde");
      }

      const beforeUploadData = await beforeUploadRes.json();

      // Upload after photo
      const afterFormData = new FormData();
      const afterBlob = await fetch(afterPhotoPreview!).then(r => r.blob());
      afterFormData.append("photo", afterBlob, "after.jpg");

      const afterUploadRes = await fetch("/api/upload/photo", {
        method: "POST",
        body: afterFormData,
      });

      if (!afterUploadRes.ok) {
        throw new Error("Kunne ikke laste opp 'etter' bilde");
      }

      const afterUploadData = await afterUploadRes.json();

      // Complete the job with photos
      const res = await fetch(`/api/jobs/${job?.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beforePhotoUrl: beforeUploadData.photoUrl,
          afterPhotoUrl: afterUploadData.photoUrl,
          conversationId,
        }),
      });

      if (res.ok) {
        toast.success("Arbeid markert som fullført!");
        setShowCompletionDialog(false);
        setBeforePhoto(null);
        setAfterPhoto(null);
        setBeforePhotoPreview(null);
        setAfterPhotoPreview(null);
        
        // Reload job data
        if (conversation) {
          const jobRes = await fetch(`/api/jobs/${conversation.job_id}`);
          if (jobRes.ok) {
            const jobData = await jobRes.json();
            setJob(jobData.job || null);
          }
        }
      } else {
        const error = await res.json();
        toast.error(`Feil: ${error.error}`);
      }
    } catch (error) {
      console.error("Feil ved fullføring av arbeid:", error);
      toast.error("Kunne ikke markere arbeid som fullført");
    } finally {
      setCompletingWork(false);
    }
  };

  const handleBeforePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeforePhoto(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleAfterPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterPhoto(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleConfirmCompletion = async () => {
    try {
      const res = await fetch(`/api/jobs/${job?.id}/confirm-completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      if (res.ok) {
        toast.success("Arbeid godkjent!");
        // Reload job data
        if (conversation) {
          const jobRes = await fetch(`/api/jobs/${conversation.job_id}`);
          if (jobRes.ok) {
            const jobData = await jobRes.json();
            setJob(jobData.job || null);
          }
        }
      } else {
        const error = await res.json();
        toast.error(`Feil: ${error.error}`);
      }
    } catch (error) {
      console.error("Feil ved bekreftelse av fullføring:", error);
      toast.error("Kunne ikke godkjenne arbeid");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="max-w-3xl mx-auto py-10 px-4 text-red-500">{error}</div>;

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto bg-white shadow-lg">
        {/* Header with Back Button and Job Info */}
        <div className="bg-white border-b shadow-sm p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/samtaler">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            {job && (
              <>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {job.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base truncate">{job.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>📍 {job.areaName}</span>
                    <span>💰 {job.payNok} NOK</span>
                    <span>📊 {job.status === "assigned" ? "Pågår" : job.status === "completed" ? "Fullført" : "Åpen"}</span>
                  </div>
                </div>
                <Link href={`/jobber/${job.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">Se jobb</Button>
                </Link>
              </>
            )}
          </div>

          {/* Action buttons based on job status and user role */}
          {job && conversation && currentUserId && (
            <div className="flex gap-2 mt-3 pt-3 border-t">
              {job.status === "assigned" && currentUserId === job.selectedWorkerId && (
                <Button
                  onClick={handleCompleteWork}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marker som fullført
                </Button>
              )}

              {job.status === "completed" && currentUserId === job.employerId && (
                <Button
                  onClick={handleConfirmCompletion}
                  size="sm"
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Godkjenn arbeid
                </Button>
              )}

              {job.status === "assigned" && currentUserId === job.selectedWorkerId && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingPhoto}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    disabled={uploadingPhoto}
                  >
                    <Camera className="w-4 h-4" />
                    {uploadingPhoto ? "Laster opp..." : "Send bilde"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ minHeight: 0 }}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <p className="text-lg mb-2">👋 Start samtalen!</p>
                <p className="text-sm">Send den første meldingen til arbeidsgiveren.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === currentUserId;
                const isSystem = msg.message_type === 'system';

                if (isSystem) {
                  // System message
                  let systemText = "";
                  switch (msg.system_event) {
                    case 'work_started':
                      systemText = "🔄 Arbeid startet";
                      break;
                    case 'work_completed':
                      systemText = "✅ Arbeid fullført av arbeider";
                      break;
                    case 'work_approved':
                      systemText = "🎉 Arbeid godkjent av arbeidsgiver";
                      break;
                    case 'work_rejected':
                      systemText = "❌ Arbeid avvist av arbeidsgiver";
                      break;
                    default:
                      systemText = "Systemhendelse";
                  }

                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {systemText}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                    {!isOwn && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                        👤
                      </div>
                    )}

                    <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isOwn ? "bg-orange-500 text-white rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm"}`}>
                      {msg.message_type === 'photo' && msg.photo_url ? (
                        <div className="space-y-2">
                          <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden">
                            <Image
                              src={msg.photo_url}
                              alt="Arbeidsbilde"
                              fill
                              className="object-cover"
                              sizes="(max-width: 320px) 100vw, 320px"
                            />
                          </div>
                          {msg.text_content && (
                            <p className="text-sm break-words">{msg.text_content}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm break-words">{msg.text_content}</p>
                      )}

                      <p className={`text-xs mt-1 ${isOwn ? "text-orange-100" : "text-gray-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {isOwn && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
                        Du
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input - Fixed at Bottom */}
        <div className="p-4 bg-white border-t shadow-lg flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Skriv en melding..." 
              autoComplete="off" 
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} className="px-6">
              {sending ? "Sender..." : "Send"}
            </Button>
          </form>
        </div>

        {/* Completion Dialog */}
        {showCompletionDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fullfør arbeid</h3>
              <p className="text-gray-600 mb-6">Last opp bilder av arbeidet før og etter for å fullføre jobben.</p>
              
              <div className="space-y-6">
                {/* Before Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📸 Før arbeid</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
                    {beforePhotoPreview ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image
                            src={beforePhotoPreview}
                            alt="Før arbeid"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBeforePhoto(null);
                            setBeforePhotoPreview(null);
                          }}
                          className="w-full"
                        >
                          Fjern bilde
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBeforePhotoSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center py-8">
                          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Klikk for å velge bilde</p>
                          <p className="text-xs text-gray-500 mt-1">eller dra og slipp</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* After Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📸 Etter arbeid</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
                    {afterPhotoPreview ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image
                            src={afterPhotoPreview}
                            alt="Etter arbeid"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAfterPhoto(null);
                            setAfterPhotoPreview(null);
                          }}
                          className="w-full"
                        >
                          Fjern bilde
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAfterPhotoSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center py-8">
                          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Klikk for å velge bilde</p>
                          <p className="text-xs text-gray-500 mt-1">eller dra og slipp</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tips:</strong> Ta klare bilder som viser arbeidet før og etter. Dette hjelper arbeidsgiveren med å godkjenne arbeidet raskere.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompletionDialog(false);
                    setBeforePhoto(null);
                    setAfterPhoto(null);
                    setBeforePhotoPreview(null);
                    setAfterPhotoPreview(null);
                  }}
                  disabled={completingWork}
                  className="flex-1"
                >
                  Avbryt
                </Button>
                <Button
                  onClick={handleSubmitCompletion}
                  disabled={!beforePhoto || !afterPhoto || completingWork}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {completingWork ? "Sender..." : "Fullfør arbeid"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
