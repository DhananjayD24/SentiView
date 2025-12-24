import admin from "firebase-admin";
import fs from "fs";

// const serviceAccount = JSON.parse(
//   fs.readFileSync("serviceAccountKey.json", "utf-8")
// );

let serviceAccount;

if (process.env.SERVICE_ACCOUNT_KEY) {
  // ✅ Production (Render)
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
} else {
  // ✅ Local development
  serviceAccount = JSON.parse(
    fs.readFileSync("serviceAccountKey.json", "utf-8")
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
