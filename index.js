const connectToMongo = require('./db')

var cors = require('cors')
const express = require('express')
connectToMongo();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// Available routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello Aman')
})


app.listen(port, () => {
  console.log(`Notex backend listening at http://localhost:${port}`)
})