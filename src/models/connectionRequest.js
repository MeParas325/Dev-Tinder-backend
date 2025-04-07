const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: "Status is not valid"
        }
    }

}, {
    timestamps: true,
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1})

// function will run before saving the connection request in the database
connectionRequestSchema.pre("save", function (next) {

    const connectionRequest = this

    // check if fromUserId and toUserid is same or not
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send connection request to yourself")
    }

    next()

})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest", 
    connectionRequestSchema
)

module.exports = ConnectionRequestModel