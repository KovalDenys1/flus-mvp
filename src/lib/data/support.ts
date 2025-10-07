export type SupportTicketStatus = "åpen" | "under arbeid" | "lukket";

export type SupportTicket = {
  id: string;
  workerId: string;
  reason: string;
  createdAt: string;
  status: SupportTicketStatus;
  notes?: string;
};

export const supportTickets: SupportTicket[] = [];