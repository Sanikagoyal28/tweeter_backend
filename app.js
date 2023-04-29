
const express = require("express");
const mongoose = require("mongoose");
const {router} = require("./routes/authRoutes")
require("dotenv").config();
const errorHandler = require('./middleware/errorHandler')

//creating an express server
const app = express();
const port = 3002;
const DB = "mongodb+srv://sanikagoyal:sanikaGoyal2810@cluster0.tzfmks9.mongodb.net/test"

app.use(express.json())

//connection with database
mongoose.connect(DB)
    .then((res) => {
        console.log(res)
        app.listen(port)
        console.log(`App is running at ${port} and Database connected`)
    })
    .catch((err) => {
        console.log(err)
    })

app.use(router)
app.use(errorHandler.Errorhandler)
app.use(errorHandler.errorHandler)
