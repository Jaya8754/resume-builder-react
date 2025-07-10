import { z } from "zod";

export const educationalInfoSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  description: z.string().optional(),
  cgpa: z.string().min(1, "CGPA is required"),
});

export type EducationalInfoType = z.infer<typeof educationalInfoSchema>;