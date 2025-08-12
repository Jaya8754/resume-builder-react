import { z } from "zod";

const singleLanguageSchema = z.object({
  language: z.string().min(2, { message: "Language name must be at least 2 characters" }),
  level: z.enum(["Beginner", "Intermediate", "Fluent", "Native"], {
    required_error: "Please select a level",
  }),
});

export const languageInfoSchema = z.object({
  languages: z.array(singleLanguageSchema).min(1, { message: "At least one language is required" }),
});

export type LanguageInfoType = z.infer<typeof languageInfoSchema>;
