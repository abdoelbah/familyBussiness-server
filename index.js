require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const userRouter = require('./router/userRoutes/router')
const adminRouter = require('./router/adminRoutes/router')

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGO_URL

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log(err)
})

// Set up CORS to allow requests from all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userRouter)
app.use(adminRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})
