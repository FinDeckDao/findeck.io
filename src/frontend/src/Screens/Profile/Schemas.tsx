import { z } from "zod"

// Define the form schema.
export const formSchema = z.object({
  userName: z.string().min(2).max(50),
  shortTerm: z.string().min(2).max(4),
  longTerm: z.string().min(2).max(4),

  // TODO: Fix this Work around to model the theme and role as strings.
  theme: z.union([
    z.literal("Light"),
    z.literal("System"),
    z.literal("Dark")
  ]),
  role: z.union([
    z.literal("Member"),
    z.literal("Administrator")
  ]),
  saveProfile: z.function(),
  error: z.string().optional(),
  loading: z.boolean().optional()
})

// Infer the type from the schema
export type ProfileFormProps = z.infer<typeof formSchema>