import { z } from "zod";

export const CreateRoleSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});
export type CreateRoleDTO = z.infer<typeof CreateRoleSchema>;
