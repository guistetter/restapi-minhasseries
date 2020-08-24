const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require("body-parser")

const mongoose = process.env.MONGO || require('mongoose')
mongoose.Promise = global.Promise
const mongo = "mongodb://localhost/minhaserie-rest-devpleno"

app.use(bodyParser({extended: true}))

const series = require('./routes/series')

app.use('/series',series)
//app.get('/series', (req, res) => res.send(series))
mongoose.connect(mongo, {useMongoClient: true})
.then(()=> {
  app.listen(port, () => console.log("app listening on port: ",port))
})
.catch(e => console.log(e))
