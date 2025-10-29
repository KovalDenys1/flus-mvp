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

export async function deleteJob(id: string, employerId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseServer();

    // First check if job exists and belongs to the user
    const { data: job, error: fetchError } = await supabase
      .from("jobs")
      .select("id, employer_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !job) {
      console.error("Job not found:", fetchError);
      return false;
    }

    if (job.employer_id !== employerId) {
      console.error("Unauthorized: job doesn't belong to user");
      return false;
    }

    // Only allow deletion of open jobs (not assigned or completed)
    if (job.status !== "open") {
      console.error("Cannot delete job with status:", job.status);
      return false;
    }

    // Delete the job
    const { error: deleteError } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting job:", deleteError);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Exception deleting job:", e);
    return false;
  }
}
