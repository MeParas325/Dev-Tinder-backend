const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileData } = require('../utils/validation');

const profileRouter = express.Router()

// get user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {

    // get the user
    const user = req.user

    // send back the user
    res.send(user);

  } catch (error) {
    res.status(400).send(error.message)
  }
});

// edit user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

  try {
    // check if data is valid or not
    if(!validateProfileData(req)) {
      throw new Error("Invalid edit Request!")
    }

    // get logged in user from the request
    const loggedInUser = req.user

    // update the user locally
    Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

    // update the user inside database
    await loggedInUser.save()

    // send user back
    res.json({
      message: "Profile updated Successfully",
      data: loggedInUser
    })
    
  } catch (error) {
      res.status(400).send(error.message)
  }
})

module.exports = profileRouter