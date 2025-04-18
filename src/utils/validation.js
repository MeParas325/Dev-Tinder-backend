const validator = require("validator")

const validateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body

    if(!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Email id is not valid")
    } else if(!validator.isStrongPassword(password)) {
        console.log("Inside strong password")
        throw new Error("Please enter a strong password")
    }
}

const validateProfileData = (req) => {

    const allowedFields = ["firstName", "lastName", "photoUrl", "about", "age"]
    
    const isEditAllowed = Object.keys(req.body).every(field => allowedFields.includes(field))
    return isEditAllowed

}

module.exports = {
    validateSignUpData,
    validateProfileData
}