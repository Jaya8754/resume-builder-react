import { z } from "zod";

export const certificationInfoSchema = z.object({
  certificationName: z.string().optional(),
  issuer: z.string().optional(),
  issuedDate: z.string().optional(),
  skillsCovered: z.string().optional(),
});

export type CertificateInfoType = z.infer<typeof certificationInfoSchema>;