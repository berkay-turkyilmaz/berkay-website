import { z } from "zod";

export const ayetInterpretBodySchema = z
  .object({
    reference: z.string().max(80).optional(),
    verseText: z.string().max(4_000).optional(),
    question: z.string().max(800).optional(),
  })
  .refine((data) => Boolean(data.reference?.trim() || data.verseText?.trim()), {
    message: "Referans veya ayet metni gerekli",
  });

export type AyetInterpretBody = z.infer<typeof ayetInterpretBodySchema>;
