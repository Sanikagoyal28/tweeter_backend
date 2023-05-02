
const express = require("express");
const mongoose = require("mongoose");
const {router} = require("./routes/authRoutes")
const errorHandler = require('./middleware/errorHandler')

require('dotenv').config();

//creating an express server
const app = express();

app.use(express.json())

//connection with database
mongoose.connect(process.env.URI)
    .then((res) => {
        app.listen(3000)
        // app.listen(process.env.port)
        console.log(`App is running at ${process.env.port} and Database connected`)
    })
    .catch((err) => {
        console.log(err)
    })

app.use(router)
app.use(errorHandler.Errorhandler)
app.use(errorHandler.errorHandler)
