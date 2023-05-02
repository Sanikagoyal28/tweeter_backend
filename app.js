const express = require("express");
const mongoose = require("mongoose");
const { errorHandler } = require('./middleware/errorHandler')
const router = require('./routes/index')

require('dotenv').config();

//creating an express server
const app = express();

// to parse json body data
app.use(express.json())

//to parse the form-data
app.use(express.urlencoded({ extended: true }))

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
app.use(errorHandler)
