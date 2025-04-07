const express = require('express')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { validateSignUpData } = require('../utils/validation')
const User = require('../models/user')
const authRouter = express.Router()

// register a user
authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignUpData(req);

    // get the user details
    const { firstName, lastName, emailId, password, photoUrl } = req.body

    // enccrypt the password
    const passswordHash = await bcrypt.hash(password, 10)

    // create user object by using User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passswordHash,
      photoUrl,
    })

    // create user in the database
    await user.save()
    // send back the response
    res.status(200).send("User created successfully")
  } catch (error) {
    // send the error as response
    res.status(400).send(error.message)
  }
})

// login a user
authRouter.post("/login", async (req, res) => {

  // extract emailId and password
  const { emailId, password } = req.body

  try {
    // validate email
    if (!validator.isEmail(emailId)) throw new Error("Email id is not valid")

    // find the user
    const user = await User.findOne({ emailId })
    if (!user) throw new Error("Invalid Crendentails")
    
    // validate the password
    const isPasswordValid = user.validatePassword(password)

    // throw error if password is not valid
    if (!isPasswordValid) throw new Error("Invalid Crendentails")

    // get the jwt token
    const token = user.getJWT()

    // set token in res cookies
    res.cookie("token", token)
    // send back the response
    res.status(200).send("Login successfully")
  } catch (error) {
    res.status(400).send(error.message)
  }
});

// logout a user
authRouter.post("/logout", async (req, res) => {

  // set the token null
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }).send("Logout successful")

})

module.exports = authRouter