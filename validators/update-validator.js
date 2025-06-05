import { z } from "zod";

const updateSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(5, { message: "username must be greater than 5 char" }),

  oldPassword: z
    .string({ required_error: "old Password is required" })
    .min(5, { message: "Password must be greater than 5 char" })
    .max(1100, { message: "Too Long Password" }),

  newPassword: z
    .string({ required_error: " new Password is required" })
    .min(5, { message: "Password must be greater than 5 char" })
    .max(1100, { message: "Too Long Password" }),
});

export default updateSchema;
