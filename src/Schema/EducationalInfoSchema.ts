import { z } from "zod";

export const educationalInfoSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  description: z.string().optional(),
  cgpa: z.string().min(1, "CGPA is required"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "Start date cannot be later than end date",
  path: ["endDate"],
});
