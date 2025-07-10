import { z } from "zod";

export const experienceInfoSchema = z.object({
  workOrInternship: z.string().optional(),
  jobtitle: z.string().optional(),
  companyname: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibilities: z.string().optional(),
});

export type ExperienceInfoType = z.infer<typeof experienceInfoSchema>;