import { z } from "zod";

export const languageSchema = z.object({
  languages: z.array(
    z.object({
      language: z.string().min(1),
      level: z.enum(["Beginner", "Intermediate", "Fluent", "Native"]),
    })
  ).min(1, "Please select at least one language."),
});
