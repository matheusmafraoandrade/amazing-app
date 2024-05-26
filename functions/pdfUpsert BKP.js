const functions = require("firebase-functions");
const admin = require("firebase-admin");
const os = require("os");
const { join } = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const splitterLangchain = require("langchain/text_splitter");
const documentLangchain = require("langchain/document");
const openaiLangchain = require("@langchain/openai");
const pineconeClient = require("@pinecone-database/pinecone");
const pineconeLangchain = require("@langchain/pinecone");

const OPENAIAPIKEY = functions.config().openai.api_key;
const PINECONEAPIKEY = functions.config().pinecone.api_key;

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.pdfUpsert = functions.storage.object().onFinalize(async (object) => {
  // Executa quando um novo arquivo é enviado ao Storage
  const filePath = object.name;

  // Check if the uploaded file is a PDF
  if (!filePath.endsWith(".pdf")) {
    return null;
  }

  const bucket = admin.storage().bucket(object.bucket);
  const filename = filePath.split("/").pop();
  const userId = filePath.split("/")[1];
  const tempFilePath = join(os.tmpdir(), filename);

  try {
    await bucket.file(filePath).download({ destination: tempFilePath });

    const data = await pdfParse(fs.readFileSync(tempFilePath));

    // Now 'data.text' contains the extracted text from the PDF
    const text = data.text.replace("\n", "");
    const splitter = new splitterLangchain.RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.splitDocuments([
      new documentLangchain.Document({
        metadata: { docName: filename.replace(".pdf", "") },
        pageContent: text,
      }),
    ]);

    /* Create instance */
    const embeddings = new openaiLangchain.OpenAIEmbeddings({
      openAIApiKey: OPENAIAPIKEY,
      model: "text-embedding-ada-002",
    });

    const pinecone = new pineconeClient.Pinecone({
      apiKey: PINECONEAPIKEY,
    });
    const pineconeIndex = pinecone.index("documents");
    const namespace = userId;

    return await pineconeLangchain.PineconeStore.fromDocuments(
      docs,
      embeddings,
      {
        pineconeIndex,
        namespace,
        // maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      }
    );
  } catch (error) {
    console.error("Error processing PDF:", error);
    return null;
  }
});
