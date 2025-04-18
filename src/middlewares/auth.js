const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

  try {
    const { token } = req.cookies;

    // if token is not valid
    if(!token) {
      return res.status(401).json({
        msg: "Unauthorized user! Please login",
      })
    }
    
    const decodedObj = jwt.verify(token, "DEV@TANUJA");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");

    req.user = user
    next();
  } catch (error) {
    
    res.status(400).send(error.message);
  }
};

module.exports = {
  userAuth,
};
