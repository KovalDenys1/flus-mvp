import { getSupabaseServer } from "../supabase/server";

export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: "sendt" | "akseptert" | "avslatt" | "completed";
  createdAt: string;
  updatedAt?: string;
  job?: {
    id: string;
    title: string;
    employer: {
      id: string;
      navn: string;
      email: string;
    };
  };
  worker?: {
    id: string;
    navn: string;
    email: string;
  };
};

export async function getApplicationsForUser(userId: string): Promise<Application[]> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        job_id,
        applicant_id,
        created_at,
        status,
        job:job_id(
          id,
          title,
          employer:employer_id(id, navn, email)
        )
      `)
      .eq("applicant_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications for user:", error);
      return [];
    }

    return (data || []).map(app => ({
      id: app.id,
      jobId: app.job_id,
      workerId: app.applicant_id,
      status: app.status,
      createdAt: app.created_at,
      job: app.job ? {
        id: (app.job as any).id,
        title: (app.job as any).title,
        employer: (app.job as any).employer
      } : undefined,
    }));
  } catch (e) {
    console.error("Exception fetching applications for user:", e);
    return [];
  }
}

export async function getApplicationsForJob(jobId: string): Promise<Application[]> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        job_id,
        applicant_id,
        created_at,
        status,
        worker:applicant_id(id, navn, email)
      `)
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications for job:", error);
      return [];
    }

    return (data || []).map(app => ({
      id: app.id,
      jobId: app.job_id,
      workerId: app.applicant_id,
      status: app.status,
      createdAt: app.created_at,
      worker: app.worker ? {
        id: (app.worker as any).id,
        navn: (app.worker as any).navn,
        email: (app.worker as any).email,
      } : undefined,
    }));
  } catch (e) {
    console.error("Exception fetching applications for job:", e);
    return [];
  }
}

export async function createApplication(jobId: string, workerId: string): Promise<Application | null> {
  try {
    const supabase = getSupabaseServer();

    // Check if application already exists
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("applicant_id", workerId)
      .maybeSingle();

    if (existing) {
      return null; // Application already exists
    }

    // Get employer auto-approval setting
    const { data: jobData } = await supabase
      .from("jobs")
      .select("employer_id")
      .eq("id", jobId)
      .single();

    if (!jobData) return null;

    const { data: employerData } = await supabase
      .from("users")
      .select("auto_approve_applications")
      .eq("id", jobData.employer_id)
      .single();

    const autoApprove = employerData?.auto_approve_applications ?? false;
    const initialStatus = autoApprove ? "akseptert" : "sendt";

    const { data, error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        applicant_id: workerId,
        status: initialStatus,
      })
      .select(`
        id,
        job_id,
        applicant_id,
        created_at,
        status,
        job:job_id(
          id,
          title,
          employer:employer_id(id, navn, email)
        )
      `)
      .single();

    if (error) {
      console.error("Error creating application:", error);
      return null;
    }

    return {
      id: data.id,
      jobId: data.job_id,
      workerId: data.applicant_id,
      status: data.status,
      createdAt: data.created_at,
      job: data.job ? {
        id: (data.job as any).id,
        title: (data.job as any).title,
        employer: (data.job as any).employer
      } : undefined,
    };
  } catch (e) {
    console.error("Exception creating application:", e);
    return null;
  }
}

export async function updateApplicationStatus(applicationId: string, status: "sendt" | "akseptert" | "avslatt" | "completed"): Promise<Application | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId)
      .select(`
        id,
        job_id,
        applicant_id,
        created_at,
        status,
        job:job_id(
          id,
          title,
          employer:employer_id(id, navn, email)
        ),
        worker:applicant_id(id, navn, email)
      `)
      .single();

    if (error) {
      console.error("Error updating application status:", error);
      return null;
    }

    return {
      id: data.id,
      jobId: data.job_id,
      workerId: data.applicant_id,
      status: data.status,
      createdAt: data.created_at,
      job: data.job ? {
        id: (data.job as any).id,
        title: (data.job as any).title,
        employer: (data.job as any).employer
      } : undefined,
      worker: data.worker ? {
        id: (data.worker as any).id,
        navn: (data.worker as any).navn,
        email: (data.worker as any).email,
      } : undefined,
    };
  } catch (e) {
    console.error("Exception updating application status:", e);
    return null;
  }
}