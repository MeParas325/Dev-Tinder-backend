const mongoose = require("mongoose")

const connectDB = async () => {

    await mongoose.connect("mongodb+srv://parasverma0527:TZC5iE3d82Nldnjb@cluster0.tca3urq.mongodb.net/devTinder")

}

module.exports = connectDB