import { z } from "zod";

export const experienceInfoSchema = z
  .object({
    experienceType: z.string(), // always required
    jobTitle: z.string().optional(),
    companyName: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    responsibilities: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const shouldValidate =
      data.experienceType === "Work" || data.experienceType === "Internship";

    // If no need to validate, return early
    if (!shouldValidate) return;

    if (!data.jobTitle || data.jobTitle.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jobTitle"],
        message: "Job title cannot be empty",
      });
    }

    if (!data.companyName || data.companyName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company name cannot be empty",
      });
    }

    if (!data.location || data.location.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location cannot be empty",
      });
    }

    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start Date is required",
      });
    }

    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End Date is required",
      });
    }

    if(!data.responsibilities){
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["responsibilities"],
        message: "Responsibilities is required"
      })
    }

    const start = new Date(data.startDate ?? "");
    const end = new Date(data.endDate ?? "");

    if (start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Start date cannot be later than end date",
      });
    }
  });
