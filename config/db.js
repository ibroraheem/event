/* Requiring the dotenv package and then calling the config() method on it. */
/**
 * ConnectDB() is a function that connects to the MongoDB database using the Mongoose library.
 */
const mongoose = require('mongoose')
require('dotenv').config()



/**
 * ConnectDB() is a function that connects to the MongoDB database using the Mongoose library.
 */
const connectDB =  () => {
   mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB;

