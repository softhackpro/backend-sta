import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(5, { message: "username must be greater than 5 char" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(5, { message: "Password must be greater than 5 char" })
    .max(1100, { message: "Too Long Password" }),
});

export default loginSchema;
