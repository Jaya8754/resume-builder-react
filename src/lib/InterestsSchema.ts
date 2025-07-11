import { z } from "zod";

export const interestsSchema = z.object({
  interests: z.array(z.string().min(1)).min(1, "At least one interest is required"),
});

export type InterestInfoType = z.infer<typeof interestsSchema>;