import { z } from "zod";
import { isChatModelId } from "@/lib/ai/groq-models";

const chatRole = z.enum(["user", "assistant", "system"]);

export const chatMessageSchema = z.object({
  role: chatRole,
  content: z.string().max(12_000),
});

export const chatPostBodySchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(40)
    .refine((msgs) => msgs.reduce((n, m) => n + m.content.length, 0) <= 40_000, {
      message: "Conversation too long",
    }),
  mode: z.enum(["terminal", "pdf", "engineer"]).default("terminal"),
  model: z.string().max(120).refine(isChatModelId, { message: "Unsupported model id" }),
  responseLength: z.enum(["short", "medium", "detailed"]).default("medium"),
  temperature: z.number().min(0).max(2).default(0.5),
  language: z.enum(["tr", "en", "de", "auto"]).default("tr"),
  provider: z.enum(["groq"]).default("groq"),
});

export type ChatPostBody = z.infer<typeof chatPostBodySchema>;
