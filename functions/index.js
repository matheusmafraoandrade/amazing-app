const { onHotmartWebhook } = require("./onHotmartWebhook");
const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { pdfUpsert } = require("./pdfUpsert");
const { chatOpenAI } = require("./chatOpenAI");
// const { onUserCreate } = require("./onUserCreate");
// const { initiateCheckout } = require("./initiateCheckout");
const { facebookCapi } = require("./facebookCapi");

module.exports = {
  onHotmartWebhook,
  onBeforeCreate,
  changePassword,
  pdfUpsert,
  chatOpenAI,
  // onUserCreate,
  // initiateCheckout,
  facebookCapi,
};
