import { z } from "zod";

export const projectInfoShema = z.object({
  projectTitle: z.string().optional(),
  description: z
    .string().optional(),

});

export type ProjectInfoType = z.infer<typeof projectInfoShema>;