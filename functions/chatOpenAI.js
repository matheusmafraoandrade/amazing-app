const functions = require("firebase-functions");
const admin = require("firebase-admin");

const openaiLangchain = require("@langchain/openai");
const pineconeClient = require("@pinecone-database/pinecone");
const pineconeStoreLangchain = require("@langchain/pinecone");
const promptTemplateLangchain = require("@langchain/core/prompts");
const stuffLangchain = require("langchain/chains/combine_documents");
const retrievalLangchain = require("langchain/chains/retrieval");

const PINECONEAPIKEY = functions.config().pinecone.api_key;
const OPENAIAPIKEY = functions.config().openai.api_key;

exports.chatOpenAI = functions.https.onCall(async (request) => {
  try {
    // Parâmetros da requisição (pergunta do usuário + ID - Namespace)
    const input = request.data.question;
    const namespace = request.data.namespace;

    // Modelo LLM
    const model = new openaiLangchain.ChatOpenAI({
      temperature: 0.7,
      openAIApiKey: OPENAIAPIKEY,
      modelName: "gpt-3.5-turbo",
    });

    // Prompt enviado ao modelo
    const prompt = promptTemplateLangchain.ChatPromptTemplate.fromTemplate(
      `Responda à pergunta do usuário.
      Contexto: {context}
      Pergunta: {input}`
    );

    // Cadeia de conversação (LLM + prompt)
    const chain = await stuffLangchain.createStuffDocumentsChain({
      llm: model,
      prompt,
    });

    // Embeddings da OpenAI
    const embeddings = new openaiLangchain.OpenAIEmbeddings({
      openAIApiKey: OPENAIAPIKEY,
      model: "text-embedding-ada-002",
    });

    // Cliente Pinecone
    const pinecone = new pineconeClient.Pinecone({
      apiKey: PINECONEAPIKEY,
    });
    const pineconeIndex = pinecone.index("documents");

    // Vector store como retriever (para realizar a busca dos documentos no banco)
    const vectorStore =
      await pineconeStoreLangchain.PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace,
      });
    const retriever = vectorStore.asRetriever(); // Posso inserir {k: n} para informar o n de documentos a retornar (default = 3)

    // Insere retriever na cadeia
    const retrievalChain = await retrievalLangchain.createRetrievalChain({
      combineDocsChain: chain,
      retriever,
    });

    // Retorna resposta como JSON
    const response = await retrievalChain.invoke({ input: input }); // Não preciso passar o contexto aqui, pois ele já vem do Pinecone

    return { response: response };
  } catch (error) {
    console.log(error.response);
  }
});
