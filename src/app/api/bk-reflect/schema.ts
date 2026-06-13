import { z } from "zod";

export const bkReflectBodySchema = z
  .object({
    reference: z.string().max(40).optional(),
    verseText: z.string().max(8_000).optional(),
    question: z.string().max(1_000).optional(),
  })
  .refine((data) => Boolean(data.reference?.trim() || data.verseText?.trim()), {
    message: "Referans veya ayet metni gerekli",
  });
