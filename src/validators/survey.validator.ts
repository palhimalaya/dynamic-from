import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),

  type: z.enum([
    "text",
    "radio",
    "checkbox",
    "rating",
  ]),

  title: z.string(),

  required: z.boolean(),

  options: z.array(z.string()).optional(),

  showIf: z
    .object({
      questionId: z.string(),
      equals: z.string(),
    })
    .optional(),
});

export const createSurveySchema = z.object({
  title: z.string().min(1),

  description: z.string().optional(),

  schema: z.object({
    questions: z.array(questionSchema),
  }),
});