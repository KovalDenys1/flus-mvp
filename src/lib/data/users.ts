import { hashPassword, verifyPassword } from "../utils/hash";

export type Role = "worker" | "employer";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  navn?: string;
  kommune?: string;
  fodselsdato?: string;
};

export const users: User[] = [];

export function findUserByEmail(email: string) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserById(id: string) {
  return users.find(u => u.id === id) || null;
}

export function createUser(data: { email: string; password: string; role: Role; navn?: string; kommune?: string; fodselsdato?: string; }) {
  if (findUserByEmail(data.email)) {
    throw new Error("User already exists");
  }
  const u: User = {
    id: "u_" + Math.random().toString(36).slice(2),
    email: data.email.trim(),
    passwordHash: hashPassword(data.password),
    role: data.role,
    navn: data.navn?.trim(),
    kommune: data.kommune?.trim(),
    fodselsdato: data.fodselsdato,
  };
  users.push(u);
  return u;
}

export function verifyLogin(email: string, password: string) {
  const u = findUserByEmail(email);
  if (!u) return null;
  return verifyPassword(password, u.passwordHash) ? u : null;
}