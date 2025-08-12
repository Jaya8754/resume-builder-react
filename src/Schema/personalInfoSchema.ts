import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  jobTitle: z.string().optional().nullable(),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().min(10, "Phone Number is required"),
  location: z.string().min(1, "Location is required"),
  linkedinProfile: z.string().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
});

export type PersonalInfoType = z.infer<typeof personalInfoSchema>;