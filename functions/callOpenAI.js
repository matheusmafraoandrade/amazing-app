const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({
  origin: [
    "http://localhost:5173",
    "http://localhost:5173/chat",
    "http://localhost:5173/inserir",
    "http://localhost:5173/arquivos",
  ],
}); // TODO: colocar meus domínios

const OPENAIAPIKEY = functions.config().openai.api_key;

exports.callOpenAI = functions.https.onRequest((req, res) => {
  // Change from onCall to onRequest
  cors(req, res, async () => {
    // Wrap your function with cors()

    //context
    try {
      const { conversation } = req.body; // Change from data to req.body
      const url = "https://api.openai.com/v1/chat/completions";

      if (!conversation || !OPENAIAPIKEY) {
        throw new functions.https.HttpsError("invalid-arg", "API Error");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAIAPIKEY}`,
      };

      const body = {
        model: "gpt-3.5-turbo",
        messages: conversation,
      };

      const response = await axios.post(url, body, { headers });

      if (response.status === 200) {
        res
          .status(200)
          .send({ response: response.data.choices[0].message.content }); // Send response with CORS headers
      } else {
        throw new functions.https.HttpsError("internal", "Request failed.");
      }
    } catch (error) {
      res.status(500).send({ error: error.message }); // Send error response with CORS headers
    }
  });
});
