const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    //Check if token match the supposed origin
    const decodedToken = await jwt.verify(token, "RANDOMTOKEN");

    const user = decodedToken;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid request",
      err,
    });
  }
};
