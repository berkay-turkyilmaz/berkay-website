import { AiLabNewChatRedirect } from "@/features/ai-lab/components/ai-lab-new-chat-redirect";

/** `/ai-lab/documents` -> `/ai-lab/documents/[new id]`. */
export default function AiLabDocumentsPage() {
  return <AiLabNewChatRedirect kind="document" />;
}
