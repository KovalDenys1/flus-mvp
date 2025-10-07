export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  status: "sendt" | "akseptert" | "avslatt";
  createdAt: string;
};

export const applications: Application[] = [];