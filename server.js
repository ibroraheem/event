/* This is the code that is required to run the server. */
const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
require('dotenv').config()

/* Setting up the server to use the various packages that are required to run the server. */
app.use(cors({
    origin: '*'
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* This is a route that is used to test if the server is running. */
app.get('/', (req, res) => {
    res.send('Hello World')
})
/* Connecting to the database. */
connectDB()
/* Telling the server to use the routes in the authRoutes file. */
app.use("/", require("./routes/authRoutes"))
/* Telling the server to use the routes in the eventRoutes file. */
app.use("/", require("./routes/eventRoutes"))
app.use("/", require("./routes/eventRoutes"))

/* Setting the port that the server will run on. */
const PORT = process.env.PORT

/* This is telling the server to listen on the port that is set in the .env file. */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})