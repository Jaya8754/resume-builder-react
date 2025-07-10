import { z } from "zod";

export const aboutMeSchema = z.object({
  aboutMe: z
    .string()
    .min(50, "About Me must be at least 50 characters long")
    .max(1000, "Keep it within 1000 characters"),
});

export type AboutMeData = z.infer<typeof aboutMeSchema>;
