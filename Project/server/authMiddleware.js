const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "SecurityKey");
    console.log("Decoded Token:", decoded);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authenticate;
