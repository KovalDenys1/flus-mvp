import { getSupabaseServer } from "../supabase/server";

export type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "open" | "assigned" | "completed" | "cancelled";
  employerId: string;
  selectedWorkerId?: string;
  address?: string;
  scheduleType?: "flexible" | "fixed" | "deadline";
  startTime?: string;
  endTime?: string;
  paymentType?: "fixed" | "hourly";
  requirements?: string;
  employer?: {
    id: string;
    navn: string;
    email: string;
  };
};

export async function getJobs(filters?: { category?: string; areaName?: string }): Promise<Job[]> {
  try {
    const supabase = getSupabaseServer();
    let query = supabase
      .from("jobs")
      .select(`
        *,
        employer:employer_id(id, navn, email)
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.areaName) {
      query = query.ilike("area_name", `%${filters.areaName}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }

    return (data || []).map((j: Record<string, unknown>) => ({
      id: j.id as string,
      title: j.title as string,
      desc: j.description as string,
      category: j.category as string,
      payNok: j.pay_nok as number,
      durationMinutes: j.duration_minutes as number,
      areaName: j.area_name as string,
      lat: j.lat as number,
      lng: j.lng as number,
      createdAt: j.created_at as string,
      status: j.status as "open" | "assigned" | "completed" | "cancelled",
      employerId: j.employer_id as string,
      selectedWorkerId: j.selected_worker_id as string | undefined,
      address: j.address as string | undefined,
      scheduleType: j.schedule_type as "flexible" | "fixed" | "deadline" | undefined,
      startTime: j.start_time as string | undefined,
      endTime: j.end_time as string | undefined,
      paymentType: j.payment_type as "fixed" | "hourly" | undefined,
      requirements: j.requirements as string | undefined,
      employer: j.employer ? {
        id: (j.employer as Record<string, unknown>).id as string,
        navn: (j.employer as Record<string, unknown>).navn as string,
        email: (j.employer as Record<string, unknown>).email as string,
      } : undefined,
    }));
  } catch (e) {
    console.error("Exception fetching jobs:", e);
    return [];
  }
}

export async function findJobById(id: string): Promise<Job | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        employer:employer_id(id, navn, email)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error finding job:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      desc: data.description,
      category: data.category,
      payNok: data.pay_nok,
      durationMinutes: data.duration_minutes,
      areaName: data.area_name,
      lat: data.lat,
      lng: data.lng,
      createdAt: data.created_at,
      status: data.status,
      employerId: data.employer_id,
      selectedWorkerId: data.selected_worker_id,
      address: data.address,
      scheduleType: data.schedule_type,
      startTime: data.start_time,
      endTime: data.end_time,
      paymentType: data.payment_type,
      requirements: data.requirements,
      employer: data.employer ? {
        id: data.employer.id,
        navn: data.employer.navn,
        email: data.employer.email,
      } : undefined,
    };
  } catch (e) {
    console.error("Exception finding job:", e);
    return null;
  }
}

export async function createJob(
  title: string,
  description: string,
  category: string,
  payNok: number,
  durationMinutes: number,
  areaName: string,
  lat: number,
  lng: number,
  employerId: string,
  address?: string,
  scheduleType?: "flexible" | "fixed" | "deadline",
  startTime?: string,
  endTime?: string,
  paymentType?: "fixed" | "hourly",
  requirements?: string
): Promise<Job | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title,
        description,
        category,
        pay_nok: payNok,
        duration_minutes: durationMinutes,
        area_name: areaName,
        lat,
        lng,
        employer_id: employerId,
        address,
        schedule_type: scheduleType,
        start_time: startTime,
        end_time: endTime,
        payment_type: paymentType,
        requirements,
        status: "open",
      })
      .select(`
        *,
        employer:employer_id(id, navn, email)
      `)
      .single();

    if (error) {
      console.error("Error creating job:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      desc: data.description,
      category: data.category,
      payNok: data.pay_nok,
      durationMinutes: data.duration_minutes,
      areaName: data.area_name,
      lat: data.lat,
      lng: data.lng,
      createdAt: data.created_at,
      status: data.status,
      employerId: data.employer_id,
      selectedWorkerId: data.selected_worker_id,
      address: data.address,
      scheduleType: data.schedule_type,
      startTime: data.start_time,
      endTime: data.end_time,
      paymentType: data.payment_type,
      requirements: data.requirements,
      employer: data.employer ? {
        id: data.employer.id,
        navn: data.employer.navn,
        email: data.employer.email,
      } : undefined,
    };
  } catch (e) {
    console.error("Exception creating job:", e);
    return null;
  }
}

export async function updateJob(id: string, updates: Partial<Omit<Job, 'id' | 'createdAt' | 'employer'>>): Promise<Job | null> {
  try {
    const supabase = getSupabaseServer();
    const updateData: Record<string, unknown> = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.desc !== undefined) updateData.description = updates.desc;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.payNok !== undefined) updateData.pay_nok = updates.payNok;
    if (updates.durationMinutes !== undefined) updateData.duration_minutes = updates.durationMinutes;
    if (updates.areaName !== undefined) updateData.area_name = updates.areaName;
    if (updates.lat !== undefined) updateData.lat = updates.lat;
    if (updates.lng !== undefined) updateData.lng = updates.lng;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.selectedWorkerId !== undefined) updateData.selected_worker_id = updates.selectedWorkerId;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.scheduleType !== undefined) updateData.schedule_type = updates.scheduleType;
    if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
    if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
    if (updates.paymentType !== undefined) updateData.payment_type = updates.paymentType;
    if (updates.requirements !== undefined) updateData.requirements = updates.requirements;

    const { data, error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        employer:employer_id(id, navn, email)
      `)
      .single();

    if (error) {
      console.error("Error updating job:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      desc: data.description,
      category: data.category,
      payNok: data.pay_nok,
      durationMinutes: data.duration_minutes,
      areaName: data.area_name,
      lat: data.lat,
      lng: data.lng,
      createdAt: data.created_at,
      status: data.status,
      employerId: data.employer_id,
      selectedWorkerId: data.selected_worker_id,
      address: data.address,
      scheduleType: data.schedule_type,
      startTime: data.start_time,
      endTime: data.end_time,
      paymentType: data.payment_type,
      requirements: data.requirements,
      employer: data.employer ? {
        id: data.employer.id,
        navn: data.employer.navn,
        email: data.employer.email,
      } : undefined,
    };
  } catch (e) {
    console.error("Exception updating job:", e);
    return null;
  }
}
