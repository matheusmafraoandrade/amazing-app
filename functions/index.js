const { onHotmartWebhook } = require("./onHotmartWebhook");
const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { callOpenAI } = require("./callOpenAI");
const { onPDFUpload } = require("./onPDFUpload");
const { pdfUpsert } = require("./pdfUpsert");
const { chatOpenAI } = require("./chatOpenAI");
// const { onUserCreate } = require("./onUserCreate");
// const { initiateCheckout } = require("./initiateCheckout");
// const { facebookCapi } = require("./facebookCapi");

module.exports = {
  onHotmartWebhook,
  onBeforeCreate,
  changePassword,
  callOpenAI,
  onPDFUpload,
  pdfUpsert,
  chatOpenAI,
  // onUserCreate,
  // initiateCheckout,
  // facebookCapi,
};
