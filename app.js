if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes')


// cors
// ....

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // form submit
// public asset
app.use(express.static('public'))

// Session
// ...

// Routes
app.use(routes)

// Error handler


// Server Start
app.listen(PORT, () => {
  console.log(`Server live and listening on PORT: ${PORT}`)
})