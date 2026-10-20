import { AiLabChatPanel } from "@/features/ai-lab/components/ai-lab-chat-panel";

export const metadata = { robots: { index: false, follow: false } };

export default async function AiLabDocumentByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AiLabChatPanel kind="document" chatId={id} />;
}
