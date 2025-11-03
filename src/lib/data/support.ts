import { getSupabaseServer } from "../supabase/server";

export type SupportTicketStatus = "open" | "in_progress" | "closed";

export type SupportTicket = {
  id: string;
  workerId: string;
  subject?: string;
  message?: string;
  category?: string;
  reason: string;
  createdAt: string;
  status: SupportTicketStatus;
  notes?: string;
  worker?: {
    navn: string;
    email: string;
  };
};

export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        id,
        worker_id,
        subject,
        message,
        category,
        created_at,
        status,
        notes,
        worker:worker_id(navn, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching support tickets:", error);
      return [];
    }

    return (data || []).map(ticket => ({
      id: ticket.id,
      workerId: ticket.worker_id,
      subject: ticket.subject,
      message: ticket.message,
      category: ticket.category,
      reason: ticket.subject && ticket.message ? `${ticket.subject}: ${ticket.message}` : ticket.subject || ticket.message || '',
      createdAt: ticket.created_at,
      status: ticket.status,
      notes: ticket.notes,
      worker: ticket.worker ? {
        navn: (ticket.worker as unknown as { navn: string; email: string }).navn,
        email: (ticket.worker as unknown as { navn: string; email: string }).email,
      } : undefined,
    }));
  } catch (e) {
    console.error("Exception fetching support tickets:", e);
    return [];
  }
}

export async function getSupportTicketsForUser(userId: string): Promise<SupportTicket[]> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("worker_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching support tickets for user:", error);
      return [];
    }

    return (data || []).map(ticket => ({
      id: ticket.id,
      workerId: ticket.worker_id,
      subject: ticket.subject,
      message: ticket.message,
      category: ticket.category,
      reason: ticket.subject && ticket.message ? `${ticket.subject}: ${ticket.message}` : ticket.subject || ticket.message || '',
      createdAt: ticket.created_at,
      status: ticket.status,
      notes: ticket.notes,
    }));
  } catch (e) {
    console.error("Exception fetching support tickets for user:", e);
    return [];
  }
}

export async function createSupportTicket(workerId: string, subject: string, message: string, category?: string): Promise<SupportTicket | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        worker_id: workerId,
        subject,
        message,
        category,
        status: "open",
      })
      .select(`
        id,
        worker_id,
        subject,
        message,
        category,
        created_at,
        status,
        notes,
        worker:worker_id(navn, email)
      `)
      .single();

    if (error) {
      console.error("Error creating support ticket:", error);
      return null;
    }

    return {
      id: data.id,
      workerId: data.worker_id,
      subject: data.subject,
      message: data.message,
      category: data.category,
      reason: `${data.subject}: ${data.message}`,
      createdAt: data.created_at,
      status: data.status,
      notes: data.notes,
      worker: data.worker ? {
        navn: (data.worker as unknown as { navn: string; email: string }).navn,
        email: (data.worker as unknown as { navn: string; email: string }).email,
      } : undefined,
    };
  } catch (e) {
    console.error("Exception creating support ticket:", e);
    return null;
  }
}

export async function updateSupportTicketStatus(ticketId: string, status: SupportTicketStatus, notes?: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServer();
    const updateData: Record<string, unknown> = { status };
    if (notes !== undefined) updateData.notes = notes;

    const { error } = await supabase
      .from("support_tickets")
      .update(updateData)
      .eq("id", ticketId);

    if (error) {
      console.error("Error updating support ticket:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Exception updating support ticket:", e);
    return false;
  }
}