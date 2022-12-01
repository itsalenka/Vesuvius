const express = require('express')
const WebSocket = require("ws");
require('dotenv').config()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const fs = require("fs")
const cors = require('cors')

const sequelize = require('./db')

const usersRouter = require('./Route/UserRoute')
const companyRouter = require('./Route/CompanyRoute')
const requestRouter = require('./Route/RequestRoute')
const secondaryRouter = require('./Route/SecondaryRoute')
const truckRouter = require('./Route/TruckRoute')
const locationRouter = require('./Route/LocationRoute')
const requestService = require('./Service/RequestService')
const errorHandler = require('./Middleware/ErrorHandlingMiddleware')

const https = require("https");

const PORT = process.env.PORT || 5000

let options = {
    key: fs.readFileSync('./security/RS-LAB25-TEN-RSA.key').toString(),
    cert: fs.readFileSync('./security/RS-TVN-TEN.crt').toString()
};

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cors())

//app.use('/api/locations', locationRouter)
app.use('/api/users', usersRouter)
app.use('/api/companies', companyRouter)
app.use('/api/requests', requestRouter)
app.use('/api/trucks', truckRouter)
app.use('/api/utils', secondaryRouter)
app.use(errorHandler)

const server = https.createServer(options, app)
server.listen(PORT, () => {console.log(`Server started on port ${PORT}`)})

const wss = new WebSocket.Server({ server })

wss.on('connection', async ws => {
    ws.send(await requestService.findAllFree())
})


app.locals.wss = wss;
