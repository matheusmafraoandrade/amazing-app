const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({
  origin: true,
}); // TODO: colocar meus domínios

const FLOWISEAPIKEY = functions.config().flowise.api_key;

exports.pdfUpsert = functions.https.onRequest((req, res) => {
  // Change from onCall to onRequest
  cors(req, res, async () => {
    // res.header("Access-Control-Allow-Origin", "*");
    const { formData } = req.body;

    const response = await fetch(
      "https://flowiseai-railway-production-32db.up.railway.app/api/v1/prediction/fd59e95c-cc25-42f1-8e4e-1ea898f43e87",
      {
        headers: { Authorization: `Bearer ${FLOWISEAPIKEY}` },
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    return result;
  });
});
