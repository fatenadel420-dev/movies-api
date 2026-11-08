import { z } from "zod";

export const createActorSchema = z.object({
  name: z.string().min(2),

  images: z.array(z.string()).default([]),

  birthdate: z.coerce.date().optional(),
});

export const updateActorSchema = z.object({
  name: z.string().min(2).optional(),
  images: z.array(z.string()).optional(),
  birthdate: z.coerce.date().optional(),
});