import { z } from "zod";

export const experienceInfoSchema = z.object({
  experienceType: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibilities: z.string().optional(),
});

export type ExperienceInfoType = z.infer<typeof experienceInfoSchema>;