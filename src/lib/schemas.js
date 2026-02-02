import { z } from "zod";

export const ProfileSchema = z.object({
  displayName: z.string().min(2).max(30),
  bio: z.string().max(160).optional(),
  image: z.string().url().optional().or(z.literal("")),
  username: z.string().min(3).regex(/^[a-z0-9._]+$/, "Invalid characters"),
  links: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Must be a valid URL"),
    icon: z.string(),
    
  }))
});