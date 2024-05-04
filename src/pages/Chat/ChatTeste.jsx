import { ChatPanel } from "@/components/chat-panel";

export default function Chat() {
  return (
    <main className="relative container flex min-h-screen flex-col">
      <div className="p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background">
        <span className="font-bold">Tomara que funcione essa porra</span>
      </div>
      <div className="flex flex-1 py-4">
        <div className="w-full">
          <ChatPanel />
        </div>
      </div>
    </main>
  );
}
