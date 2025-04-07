const express = require("express")
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")

// routes
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

const app = express();

// middlewares
app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log("Server is listening at 3001 port.");
    });
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Unable to connect with db");
  });
