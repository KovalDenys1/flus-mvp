export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: "sendt" | "akseptert" | "avslatt" | "completed";
  createdAt: string;
  // When the application was accepted/rejected
  updatedAt?: string;
};

export const applications: Application[] = [];