import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config"; // TODO: rever isso
import { delay } from "./utils.ts";

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        pod: {
          environment: "gcp-starter",
          podType: "starter",
        },
      },
    });
    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.INDEX_INIT_TIMEOUT);
    console.log("Index created!");
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Index creation failed");
  }
}

async function initPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    const indexName = env.PINECONE_INDEX_NAME;

    const existingIndexes = await pineconeClient.listIndexes();
    const indexExists = existingIndexes.indexes?.some(
      (index) => index.name === indexName
    );

    if (!indexExists) {
      createIndex(pineconeClient, indexName);
    } else {
      console.log("Index already exists!");
    }

    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}
