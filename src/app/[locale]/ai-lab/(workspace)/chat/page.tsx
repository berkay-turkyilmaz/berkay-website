import { AiLabNewChatRedirect } from "@/features/ai-lab/components/ai-lab-new-chat-redirect";

/** `/ai-lab/chat` -> `/ai-lab/chat/[new id]`. */
export default function AiLabNewChatPage() {
  return <AiLabNewChatRedirect kind="chat" />;
}
