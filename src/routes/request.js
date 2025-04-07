const express = require('express')
const requestRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

// send connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

   try {

    // fetching user id from the request
    const fromUserId = req.user._id

    // feching receiver user id and status from the request
    const toUserId = req.params.toUserId
    const status = req.params.status

    // checking for allowing status
    const allowedStatus = ["ignore", "interested"]

    // if status is not in out allowedStatus then send back the response as bad request
    if(!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Bad Request"
      })
    }

    // check if to user exist in database
    const toUser = await User.findById(toUserId)

    // if not exist send back the response as user not found
    if(!toUser) {
      return res.status(400).json({
        message: "User not found"
      })
    }

    // check if there is an existing connectionRequest
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId
        }
      ],
    })

    // if connection request already exists then return the response as connection request already exists
    if(existingRequest) {
      return res
      .status(400)
      .json({
        message: "Connection request already exists"
      })
    }

    // creating an instance of connection request with new values
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    // saving the data into the database
    const data = await connectionRequest.save()

    // sending back the response
    res.json({
      data,
      msg: `${req.user.firstName} is ${status} ${status === 'interested' ? 'in' : ''} ${toUser.firstName}`,
    })
    
    
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// review connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => { 

  const loggedInUser = req.user
  const { status, requestId} = req.params

  try{

    // allowed status
    const allowedStatus = ["accepted", "rejected"]

    // check if status is valid or not
    if(!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status"
      })
    }

    // check if connection request for logged in user is exist or not
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    })

    // if connection request if not found return request is not found
    if(!connectionRequest) {
      return res.status(400).json({
        message: "Request is not found"
      })
    }

    // if connection request is found change the status of that connection request
    connectionRequest.status = status

    // save the updated connection request to the database
    const data = await connectionRequest.save()

    // return the response with updated connection request
    res.json({
      message: "Connection request " + status,
      data,
    })

    res
  } catch(error) {
    res.status(400).send(error.message)
  }
})

module.exports = requestRouter