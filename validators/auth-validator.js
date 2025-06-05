import { z } from "zod";

const signupSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .min(5, { message: "username must be greater than 5 characters" }),

  userType: z
    .number({ required_error: "userType is required" })
    .min(0, { message: "use 0 for admin" })
    .max(5, { message: "use 5 for user" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),

  commision: z
    .number({ required_error: "commision is required" })
    .max(100, { message: "commision must not be greater than 100" }),

  exposureLimit: z.number({ required_error: "exposureLimit is required" }),

  creditReference: z.number({ required_error: "creditReference is required" }),

  mobileNumber: z
    .string({ required_error: "mobileNumber is required" })
    .trim()
    .min(10, { message: "mobileNumber must be at least 10 digits" }),

  partnership: z.number({ required_error: "partnership is required" }),

  openingBalance: z
    .number({ required_error: "opening balance is required" })
    .min(100, { message: "opening balance should be greater than 100" }),
});

export default signupSchema;
