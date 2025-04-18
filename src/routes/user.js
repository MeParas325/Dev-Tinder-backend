const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const userRouter = express.Router()
const User = require('../models/user')

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "age", "gender", "skills"]

// get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {

        // get the user from the req
        const loggedInUser = req.user

        // get the connection requests for the logged in user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "age", "gender"])

        // send back the response
        res.json({
            message: "Connection requests fetched successfully",
            connectionRequests
        })

    } catch(error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// get all user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {
        // get the user from the req
        const loggedInUser = req.user

        // get the connection for the logged in user
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "skills"])
        .populate("toUserId", ["firstName", "lastName", "photoUrl", "about", "skills"])

        // filter the connections to get only the connections with the logged in user
        let connectionsWithUser = connections.map((connection) => {
            if(connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId
            } else {
                return connection.fromUserId
            }
        })

        // send back the connections
        res.json({
            message: "Connections fetched successfully",
            connectionsWithUser
        })
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// get feed for loggedin user
userRouter.get("/user/feed", userAuth, async (req, res) => {

    try {

        // get page and limit from the query params
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        
        // make sure limit wont exceed by 50 limits
        limit = limit > 50 ? 50 : limit
        // find how many documents you wants to skip
        const skip = (page - 1) * 10

        // get the logged in user from the req
        const loggedInUser = req.user

        // find all the connection request send or receive by the user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id
                },
                {
                    toUserId: loggedInUser._id
                }
            ]
        })
        .select(["fromUserId", "toUserId"])

        const hiddenUsersId = new Set();
        // get the users id from the connection request which we dont want to show in logged in user feed
        connectionRequest.forEach((req) => {
            hiddenUsersId.add(req.fromUserId.toString())
            hiddenUsersId.add(req.toUserId.toString())
        })

        // get all the users which we want to show in the feed of logged in user
        const feed = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } }, // exclude the logged in user
                { _id: { $nin: Array.from(hiddenUsersId) } } // exclude the users which we dont want to show
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        // send back the response
        res.json({
            message: "Feed fetched successfully",
            feed
        })


        
    } catch (error) {
        res.status(400).send(error.message)
    }
})


// export user router
module.exports = userRouter