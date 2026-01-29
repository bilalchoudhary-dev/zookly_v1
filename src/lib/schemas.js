import { z } from "zod";

export const ProfileSchema = z.object({
  displayName: z.string().min(2).max(30),
  bio: z.string().max(160).optional(),
  links: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Must be a valid URL"),
    icon: z.string()
  }))
});