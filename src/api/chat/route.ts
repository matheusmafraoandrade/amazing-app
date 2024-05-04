import axios from "axios"; // Importe o Axios para fazer requisições HTTP
import { callChain } from "@/lib/langchain";

export async function POST(req: any) {
  const { question, chatHistory } = await req.json();

  if (!question) {
    return new Response("Error: No question in the request", {
      status: 400,
    });
  }

  try {
    const transformStream = new TransformStream();
    const readableStream = callChain({
      question,
      chatHistory,
      transformStream,
    });

    // Retorne a resposta da requisição como um objeto Response
    return new Response(await readableStream);
  } catch (error) {
    console.error("Internal server error", error);
    return new Response("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}
