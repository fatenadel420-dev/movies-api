
import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1),

  year: z.coerce.number().int().min(1888).max(2100),

  genres: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value.split(",").map((item) => item.trim());
        }
      }
      return value;
    },
    z.array(z.string()).default([])
  ),

  description: z.string().min(1),

  trailerLink: z.string().optional(),

  director: z.string().min(1),

  image: z.string().optional(),

  actors: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return [value];
        }
      }
      return value;
    },
    z.array(z.string()).optional()
  ),
});

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),

  year: z.coerce.number().int().min(1888).max(2100).optional(),

  genres: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value.split(",").map((item) => item.trim());
        }
      }
      return value;
    },
    z.array(z.string()).optional()
  ),

  description: z.string().min(1).optional(),

  trailerLink: z.string().optional(),

  director: z.string().min(1).optional(),

  image: z.string().optional(),

  actors: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return [value];
        }
      }
      return value;
    },
    z.array(z.string()).optional()
  ),
});
