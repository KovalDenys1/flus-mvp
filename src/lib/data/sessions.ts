export type Session = {
  token: string;
  userId: string;
  createdAt: number;
};

export const sessions: Session[] = [];

export function createSession(userId: string) {
  const token = "s_" + Math.random().toString(36).slice(2);
  const sess: Session = { token, userId, createdAt: Date.now() };
  sessions.push(sess);
  return sess;
}

export function findSession(token: string | undefined | null) {
  if (!token) return null;
  return sessions.find(s => s.token === token) || null;
}

export function deleteSession(token: string | undefined | null) {
  if (!token) return false;
  const i = sessions.findIndex(s => s.token === token);
  if (i >= 0) {
    sessions.splice(i, 1);
    return true;
  }
  return false;
}