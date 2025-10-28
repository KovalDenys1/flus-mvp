import { hashPassword, verifyPassword } from "../utils/hash";
import { getSupabaseServer } from "../supabase/server";

export type Role = "worker" | "employer";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  navn?: string;
  kommune?: string;
  fodselsdato?: string;
  birth_year?: number;
  telefon?: string;
  auto_approve_applications?: boolean;
  created_at?: string;
  updated_at?: string;
};

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Error finding user by email:", error);
      return null;
    }

    return data as User | null;
  } catch (e) {
    console.error("Exception finding user by email:", e);
    return null;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error finding user by id:", error);
      return null;
    }

    return data as User | null;
  } catch (e) {
    console.error("Exception finding user by id:", e);
    return null;
  }
}

export async function createUser(data: {
  email: string;
  password: string;
  role: Role;
  navn?: string;
  kommune?: string;
  fodselsdato?: string;
  birth_year?: number;
  telefon?: string;
}): Promise<User> {
  // Check if user already exists
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("User already exists");
  }

  try {
    const supabase = getSupabaseServer();
    const userData = {
      email: data.email.trim().toLowerCase(),
      password_hash: hashPassword(data.password),
      role: data.role,
      navn: data.navn?.trim(),
      kommune: data.kommune?.trim(),
      fodselsdato: data.fodselsdato,
      birth_year: data.birth_year,
      telefon: data.telefon?.trim(),
      auto_approve_applications: data.role === "employer" ? false : undefined,
    };

    const { data: inserted, error } = await supabase
      .from("users")
      .insert(userData)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }

    return {
      id: inserted.id,
      email: inserted.email,
      passwordHash: inserted.password_hash,
      role: inserted.role,
      navn: inserted.navn,
      kommune: inserted.kommune,
      fodselsdato: inserted.fodselsdato,
      birth_year: inserted.birth_year,
      telefon: inserted.telefon,
      auto_approve_applications: inserted.auto_approve_applications,
      created_at: inserted.created_at,
      updated_at: inserted.updated_at,
    };
  } catch (e) {
    console.error("Exception creating user:", e);
    throw new Error("Failed to create user");
  }
}

export async function verifyLogin(email: string, password: string): Promise<User | null> {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;

    return verifyPassword(password, user.passwordHash) ? user : null;
  } catch (e) {
    console.error("Exception verifying login:", e);
    return null;
  }
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'passwordHash' | 'created_at'>>): Promise<User | null> {
  try {
    const supabase = getSupabaseServer();

    const updateData: Record<string, unknown> = {};
    if (updates.navn !== undefined) updateData.navn = updates.navn?.trim();
    if (updates.kommune !== undefined) updateData.kommune = updates.kommune?.trim();
    if (updates.fodselsdato !== undefined) updateData.fodselsdato = updates.fodselsdato;
    if (updates.birth_year !== undefined) updateData.birth_year = updates.birth_year;
    if (updates.telefon !== undefined) updateData.telefon = updates.telefon?.trim();
    if (updates.auto_approve_applications !== undefined) updateData.auto_approve_applications = updates.auto_approve_applications;
    if (updates.role !== undefined) updateData.role = updates.role;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      role: data.role,
      navn: data.navn,
      kommune: data.kommune,
      fodselsdato: data.fodselsdato,
      birth_year: data.birth_year,
      telefon: data.telefon,
      auto_approve_applications: data.auto_approve_applications,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (e) {
    console.error("Exception updating user:", e);
    return null;
  }
}