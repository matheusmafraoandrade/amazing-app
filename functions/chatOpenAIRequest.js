const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: [
    "http://localhost:5173",
    "http://localhost:5173/chat",
    "http://localhost:5173/inserir",
    "http://localhost:5173/arquivos",
  ],
  credentials: true,
}); // TODO: colocar meus domínios

const openaiLangchain = require("@langchain/openai");
const pineconeClient = require("@pinecone-database/pinecone");
const pineconeStoreLangchain = require("@langchain/pinecone");
const promptTemplateLangchain = require("@langchain/core/prompts");
const stuffLangchain = require("langchain/chains/combine_documents");
const retrievalLangchain = require("langchain/chains/retrieval");

const PINECONEAPIKEY = functions.config().pinecone.api_key;
const OPENAIAPIKEY = functions.config().openai.api_key;

exports.chatOpenAI = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { data } = req.body;

      const input = data.question;
      const namespace = data.namespace;

      console.log(req.body);
      console.log(data);
      console.log(input);
      console.log(namespace);

      const model = new openaiLangchain.ChatOpenAI({
        temperature: 0.7,
        openAIApiKey: OPENAIAPIKEY,
        modelName: "gpt-3.5-turbo",
      });
      console.log("Model OK");

      const prompt = promptTemplateLangchain.ChatPromptTemplate.fromTemplate(
        `Responda à pergunta do usuário.
      Contexto: {context}
      Pergunta: {input}`
      );
      console.log("Prompt OK");
      // console.log(prompt);

      const chain = await stuffLangchain.createStuffDocumentsChain({
        llm: model,
        prompt,
      });
      console.log("Chain OK");

      const embeddings = new openaiLangchain.OpenAIEmbeddings({
        openAIApiKey: OPENAIAPIKEY,
        model: "text-embedding-ada-002",
      });
      console.log("Embeddings OK");

      const pinecone = new pineconeClient.Pinecone({
        apiKey: PINECONEAPIKEY,
      });
      const pineconeIndex = pinecone.index("documents");
      console.log("Pinecone OK");

      const vectorStore =
        await pineconeStoreLangchain.PineconeStore.fromExistingIndex(
          embeddings,
          {
            pineconeIndex,
            namespace,
          }
        );
      const retriever = vectorStore.asRetriever(); // Posso inserir {k: n} para informar o n de documentos a retornar (default = 3)
      console.log("Retriever OK");

      const retrievalChain = await retrievalLangchain.createRetrievalChain({
        combineDocsChain: chain,
        retriever,
      });
      console.log("Retrieval chain OK");

      const response = await retrievalChain.invoke({ input: input }); // Não preciso passar o contexto aqui, pois ele já vem do Pinecone
      console.log("Response OK");

      if (response.status === 200) {
        res.status(200).send({ response: response }); // Send response with CORS headers
        console.log(response);
      } else {
        throw new functions.https.HttpsError("internal", "Request failed.");
      }
    } catch (error) {
      res.status(500).send({ error: error.message }); // Send error response with CORS headers
      console.log(error.response);
    }
  });
});
