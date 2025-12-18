import admin from "../config/firebaseAdmin.js";

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Guest user
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
      picture: decodedToken.picture,
    };

    next();
  } catch (error) {
    console.log("Firebase token invalid:", error.message);
    req.user = null;
    next(); // still allow guest access
  }
};

export default firebaseAuth;
