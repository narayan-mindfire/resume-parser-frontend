import { z } from "zod";

export const editProfileSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  profileImage: z.any().optional(),
});
