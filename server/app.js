/// import component
const express = require('express')
const cors  = require('cors')
const router = require('./utils/router')

/// setting up node!😉
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

/// configure base endpoint!🕶
app.use('/api/v1', router)

/// configure port when api is starting...
app.listen(process.env.API_PORT, () => console.log('Api has been starting..., in port ', process.env.API_PORT, 'type of ', process.env.TYPE_OF_DEPLOYMENT))