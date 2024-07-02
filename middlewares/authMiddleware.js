const process = require('node:process');
const jwt = require("jsonwebtoken");
const {
  TOKEN_NOT_GENERATED,
  TOKEN_EXPIRES,
} = require('../controllers/statusCodes');

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(TOKEN_NOT_GENERATED).json({ message: "Token doesn't exist, authorization denied" });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if(err){
        res.status(TOKEN_EXPIRES).json({message: 'token expires', err});
      }
      req.user = decoded;
      next();
    }
  )
};

module.exports = authMiddleware;
