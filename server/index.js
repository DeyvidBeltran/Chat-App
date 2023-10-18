const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoute = require("./routes/userRoute")

const app = express()
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use("/api/users", userRoute)

app.get("/", (req, res) => {
  res.send("Welcome")
})

const port = process.env.PORT || 3000
const mongo_uri = process.env.MONGO_URI || 4000

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`)
})

mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conection established"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message))
