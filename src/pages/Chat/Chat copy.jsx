import { useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const chatOpenAI = httpsCallable(functions, "chatOpenAI");

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();
  const { addDocument: addMessage } = useFirestore("messages");
  const { documents: messages } = useCollection("messages");

  const data = {
    question: prompt,
    namespace: user.uid,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      chatOpenAI({ data }).then((result) => {
        setApiResponse(result.data.response.answer);
        setLoading(false);
        const { payload: messageId } = addMessage({
          user: user.uid,
          question: prompt,
          answer: apiResponse,
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-grow overflow-y-auto">
        {apiResponse && (
          <div className="bg-gray-200 rounded-lg p-2 mb-2">
            <strong>Bot:</strong> {apiResponse}
          </div>
        )}
      </div>
      <form className="flex mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          placeholder="Mensagem..."
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-2 rounded-l-lg border"
        />
        <button
          disabled={loading || prompt.length === 0}
          type="submit"
          className={`p-2 rounded-r-lg ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
