const process = require('node:process');
const jwt = require("jsonwebtoken");
// const {
//   TOKEN_NOT_GENERATED,
//   TOKEN_EXPIRES,
// } = require('../controllers/statusCodes');

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(400).json({ message: "Token doesn't exist, authorization denied" });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, decoded) => {
      if(error){
        console.error(error);
        return res.status(400).json({message: 'token expires', error});
      }
      req.user = decoded;
      next();
    }
  )
};

module.exports = authMiddleware;
