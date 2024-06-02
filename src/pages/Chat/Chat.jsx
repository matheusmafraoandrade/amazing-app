import { useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { useCollection } from "@/hooks/useCollection";
import { useAuthContext } from "@/hooks/useAuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const chatOpenAI = httpsCallable(functions, "chatOpenAI");

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();
  const { addDocument: addMessage, updateDocument: updateMessage } =
    useFirestore("messages");
  const { documents: messages } = useCollection("messages");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const question = prompt;
    setPrompt("");

    const { payload: messageId } = await addMessage({
      user: user.uid,
      question: question,
      createdAt: new Date(),
    });

    const data = {
      question: question,
      namespace: user.uid,
    };

    try {
      chatOpenAI({ data }).then((result) => {
        const chatResponse = result.data.response.answer;
        setLoading(false);
        updateMessage(messageId, { answer: chatResponse });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen py-16 px-24 border border-border">
      <div className="overflow-y-auto flex flex-col-reverse flex-grow">
        {messages &&
          messages
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((message, index) => (
              <div key={index} className="mb-2">
                <div className="mb-2 mr-2 text-right">
                  <span className="bg-teal-800 text-white rounded-lg py-2 px-4 inline-block">
                    {message?.question}
                  </span>
                </div>
                <div className="mb-2 ml-2">
                  <span className="bg-primary-foreground text-primary rounded-lg py-2 px-4 inline-block">
                    {message?.answer}
                  </span>
                </div>
              </div>
            ))}
      </div>
      <form className="flex mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          placeholder="Mensagem..."
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-2 rounded-l-lg border bg-primary-foreground"
        />
        <button
          disabled={loading || prompt.length === 0}
          type="submit"
          className={`p-2 rounded-r-lg ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-teal-800 text-white hover:bg-teal-600"
          }`}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
