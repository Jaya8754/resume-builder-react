import { z } from "zod";

export const baseProjectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
});

export const projectInfoShema = baseProjectSchema.refine(
  (data) => {
    const hasTitle = data.projectTitle?.trim();
    const hasDesc = data.description?.trim();
    return !hasTitle && !hasDesc ? true : !!(hasTitle && hasDesc);
  },
  {
    message: "Both title and description are required if one is filled.",
    path: ["description"], 
  }
);
