const mongoose = require('mongoose')
require('colors')
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,

        })
        console.log(`mongo connected ${conn.connection.host}`.magenta.inverse)
    } catch (error) {
        console.error(`error : ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDb;