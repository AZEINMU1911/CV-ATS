require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const route = require("./routes/routes")
const {errorHandler} = require("./middlewares/errorHandler")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(route)
app.use(errorHandler)


module.exports = app