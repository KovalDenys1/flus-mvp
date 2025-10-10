
export type Conversation = {
  id: string;
  // ID пользователя, который инициировал чат (например, работодатель)
  initiatorId: string;
  // ID пользователя, который откликнулся (например, соискатель)
  participantId: string;
  // ID вакансии, к которой относится чат
  jobId: string;
  createdAt: string;
};

// Temporary in-memory storage. Will be replaced by a database in production.
const conversations: Conversation[] = [];

// Demo job id used for synthetic demo conversations shown to users.
export const DEMO_CONVERSATION_JOB_ID = "demo_job_1";

export function makeDemoConversationForUser(userId: string): Conversation {
  return {
    id: `demo_conv_${userId}`,
    jobId: DEMO_CONVERSATION_JOB_ID,
    initiatorId: "demo_employer",
    participantId: userId,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  };
}

/**
 * Находит или создает новый чат между двумя пользователями по поводу конкретной вакансии.
 * Это гарантирует, что для одной и той же вакансии между двумя пользователями будет только один чат.
 */
export function findOrCreateConversation(jobId: string, initiatorId: string, participantId: string): Conversation {
  let conversation = conversations.find(c => 
    c.jobId === jobId &&
    ((c.initiatorId === initiatorId && c.participantId === participantId) ||
     (c.initiatorId === participantId && c.participantId === initiatorId))
  );

  if (!conversation) {
    conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      jobId,
      initiatorId,
      participantId,
      createdAt: new Date().toISOString(),
    };
    conversations.push(conversation);
  }

  return conversation;
}

/**
 * Находит все чаты для конкретного пользователя.
 */
export function getConversationsForUser(userId: string): Conversation[] {
  const res = conversations.filter(c => c.initiatorId === userId || c.participantId === userId);
  // Always include a demo conversation for the user (if not already present).
  const hasDemo = res.some(c => c.jobId === DEMO_CONVERSATION_JOB_ID);
  if (!hasDemo && userId) {
    res.unshift(makeDemoConversationForUser(userId));
  }
  return res;
}

/**
 * Находит чат по его ID.
 */
export function getConversationById(conversationId: string): Conversation | undefined {
  return conversations.find(c => c.id === conversationId);
}
