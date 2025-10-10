
"use client";

import { useEffect, useState, useRef } from "react";
import { Message } from "@/lib/data/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Extract id from params for future compatibility
  const id = params.id;
  const conversationId = id;

  // Scroll to the last message in the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch current user id from session
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUserId(data.user.id);
        } else {
          setError("Du må være logget inn for å se denne samtalen.");
        }
      });
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`);
        if (!res.ok) {
          throw new Error(`Failed to fetch messages: ${res.statusText}`);
        }
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
    // Optionally: add polling for new messages
    // const interval = setInterval(fetchMessages, 5000);
    // return () => clearInterval(interval);
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage("");
    } catch {
      toast.error("Kunne ikke sende melding.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-10 px-4">Laster meldinger...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.senderId === currentUserId
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <CardContent className="p-0">
                <p className="text-sm">{msg.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv en melding..."
            autoComplete="off"
            disabled={sending}
          />
          <Button type="submit" disabled={sending}>
            {sending ? "Sender..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
