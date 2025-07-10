import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  jobTitle: z.string().optional(),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().min(10, "Phone Number is required"),
  location: z.string().min(1, "Location is required"),
  linkedinProfile: z.string().optional(),
  portfolio: z.string().optional(),
  profilePicture: z.string().min(1, "Profile Picture is required"),
});

export type PersonalInfoType = z.infer<typeof personalInfoSchema>;