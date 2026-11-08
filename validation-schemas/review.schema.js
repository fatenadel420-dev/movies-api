import { z } from "zod";

export const createReviewSchema = z.object({
  number: z.number().min(0).max(10),
  comment: z.string().max(1000).optional(),
});

export const updateReviewSchema = z.object({
  number: z.number().min(0).max(10).optional(),
  comment: z.string().max(1000).optional(),
});