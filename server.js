const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname, 'public'))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send('Hello World')
})

connectDB()
app.use("/admin", require("./routes/authRoutes"))
app.use("/event", require("./routes/eventRoutes"))
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})