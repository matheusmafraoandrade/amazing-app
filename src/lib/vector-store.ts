import { env } from "./config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export async function embedAndStoreDocs(
  client: Pinecone, // Already initialized index
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[] // Chunked document
) {
  try {
    const embeddings = new OpenAIEmbeddings(); // LLM API "text-ada-002"
    const index = client.Index(env.PINECONE_INDEX_NAME);

    // Embed PDF docs
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text", // TODO: quando tiver um plano serverless, adicionar namespace ao .env e colocar aqui
    });
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs!");
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings(); // LLM
    const index = client.Index(env.PINECONE_INDEX_NAME);

    // Embed PDF docs
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text", // TODO: quando tiver um plano serverless, adicionar namespace ao .env e colocar aqui
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to get vector store!");
  }
}
