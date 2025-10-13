
import ChatClient from "@/components/ChatClient";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatClient conversationId={id} />;
}
