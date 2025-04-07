const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    about: {
        type: String,
        default: "Default About"
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Enter a valid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Please enter a Strong Password")
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {
            
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "data:image/png;base64,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",
        validate(value) {

            if(!validator.isURL(value)) {
                throw new Error("Invalid Photo URL")
            }
        }
        
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true,
})

userSchema.methods.getJWT =  function () {
    // create a jwt
    const token = jwt.sign({ _id: this._id }, "DEV@TANUJA", {
        expiresIn: "1d",
      })

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, this.password)

    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)