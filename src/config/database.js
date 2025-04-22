const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_URL)
        
    } catch (error) {
        console.log("Error aa gyi: ", error.message)
    }

}

module.exports = connectDB