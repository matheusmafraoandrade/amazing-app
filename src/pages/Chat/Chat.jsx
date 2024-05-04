import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/hooks/useAuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const chatOpenAI = httpsCallable(functions, "chatOpenAI");

const chatOpenAIFunctionURL =
  "https://us-central1-pdf-chatter-bdadd.cloudfunctions.net/chatOpenAI";

const callOpenAIFunctionURL =
  "https://us-central1-pdf-chatter-bdadd.cloudfunctions.net/callOpenAI";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const data = {
    question: prompt,
    namespace: user.uid,
  };
  //overrideConfig: { pineconeNamespace: user.uid },

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log({ data });
    console.log(typeof data.question);
    console.log(typeof data.namespace);

    chatOpenAI({ data }).then((result) =>
      setApiResponse(result.data.response.answer)
    );

    // try {
    //   const response = await axios.post(chatOpenAIFunctionURL, {
    //     data: data,
    //   });

    //   console.log(response);
    //   const openAIResponse = response;
    //   setApiResponse(openAIResponse);
    // } catch (error) {
    //   console.error("Error:", error.response);
    // }

    // try {
    //   const response = await axios.post(callOpenAIFunctionURL, {
    //     conversation: [{ role: "user", content: prompt }],
    //   });
    //   const openAIResponse = response.data.response;
    //   setApiResponse(openAIResponse);
    // } catch (error) {
    //   console.error("Error:", error);
    // }

    setLoading(false);
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
          placeholder="Type your message here..."
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-2 rounded-l-lg border"
        />
        <button
          disabled={loading || prompt.length === 0}
          type="submit"
          className="p-2 rounded-r-lg bg-blue-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Send"}
        </button>
      </form>
    </div>
  );
}
