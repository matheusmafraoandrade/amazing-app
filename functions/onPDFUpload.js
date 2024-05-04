const functions = require("firebase-functions");
const admin = require("firebase-admin");
const os = require("os");
const { join } = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

if (!admin.apps.length) {
  admin.initializeApp();
}
const firestore = admin.firestore();

exports.onPDFUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;

  // Check if the uploaded file is a PDF
  if (!filePath.endsWith(".pdf")) {
    return null;
  }

  const bucket = admin.storage().bucket(object.bucket);
  const filename = filePath.split("/").pop();
  const tempFilePath = join(os.tmpdir(), filename);

  try {
    await bucket.file(filePath).download({ destination: tempFilePath });

    const data = await pdfParse(fs.readFileSync(tempFilePath));

    // Now 'data.text' contains the extracted text from the PDF
    const text = data.text;
    console.log(text);

    return firestore
      .collection("pdfTexts")
      .add({
        fileName: filePath,
        text: text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        fs.unlinkSync(tempFilePath); // Delete temporary file after successful upload
      })
      .catch((error) => {
        console.error("Error adding data to firestore:", error);
      });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return null;
  }
});
