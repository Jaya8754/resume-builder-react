import { z } from "zod";

export const baseCertificationSchema = z.object({
  certificationName: z.string().min(1, "Certificate Name is required").optional(),
  issuer: z.string().min(1, "Issuer is required").optional(),
  issuedDate: z.string().min(1, "Issued Date is required").optional(),
  skillsCovered: z.array(z.string()).min(1, "At least one skill is required").optional(),
});

export const certificationInfoSchema = baseCertificationSchema.refine(
  (data) => {
    const hasName = !!data.certificationName?.trim();
    const hasIssuer = !!data.issuer?.trim();
    const hasIssuedDate = !!data.issuedDate?.trim();
    const hasSkills = !!(data.skillsCovered && data.skillsCovered.length > 0);

    const allEmpty = !hasName && !hasIssuer && !hasIssuedDate && !hasSkills;
    const allFilled = hasName && hasIssuer && hasIssuedDate && hasSkills;

    return allEmpty || allFilled;
  }
);

export type CertificateInfoType = z.infer<typeof certificationInfoSchema>;
