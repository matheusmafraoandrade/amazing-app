const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({
  origin: true,
  credentials: true,
}); // TODO: colocar meus domínios

const FLOWISEAPIKEY = functions.config().flowise.api_key;
const OPENAIAPIKEY = functions.config().openai.api_key;

exports.chatOpenAI = functions.https.onRequest((req, res) => {
  // Change from onCall to onRequest
  cors(req, res, async () => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    const { data } = req.body;
    data.overrideConfig.openAIApiKey = OPENAIAPIKEY;

    const response = await fetch(
      "https://flowiseai-railway-production-32db.up.railway.app/api/v1/prediction/d7cacf38-965c-49cb-84e0-9d3392bb36ec",
      {
        headers: {
          Authorization: `Bearer ${FLOWISEAPIKEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  });
});
