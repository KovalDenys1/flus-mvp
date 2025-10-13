"use client";

import { useEffect, useState, useRef } from "react";
import { Message } from "@/lib/data/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
};

type Conversation = {
  id: string;
  jobId: string;
  initiatorId: string;
  participantId: string;
  createdAt: string;
};

export default function ChatClient({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUserId(data.user.id);
        else setError("You must be signed in to view this conversation.");
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
        
        if (!messagesRes.ok) throw new Error(`Failed to fetch messages: ${messagesRes.status}`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
        
        if (convRes.ok) {
          const convData = await convRes.json();
          const currentConv = (convData.conversations || []).find((c: Conversation) => c.id === conversationId);
          if (currentConv) {
            const jobRes = await fetch(`/api/jobs/${currentConv.jobId}`);
            if (jobRes.ok) {
              const jobData = await jobRes.json();
              setJob(jobData.job || null);
            }
          }
        }
      } catch {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [conversationId, currentUserId]);

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
      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage("");
    } catch {
      toast.error("Could not send message.");
    } finally {
      setSending(false);
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
                </div>
              </div>
              <Link href={`/jobber/${job.id}`}>
                <Button variant="outline" size="sm" className="text-xs">Se jobb</Button>
              </Link>
            </>
          )}
        </div>
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
              const isOwn = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                  {!isOwn && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                      👤
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isOwn ? "bg-orange-500 text-white rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm"}`}>
                    <p className="text-sm break-words">{msg.text}</p>
                    <p className={`text-xs mt-1 ${isOwn ? "text-orange-100" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" })}
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
    </div>
  );
}
