import { z } from "zod";

export const submitResponseSchema = z.object({
  answers: z.record(
    z.string(),
    z.union([
      z.string(),
      z.number(),
      z.array(z.string()),
    ])
  ),
});