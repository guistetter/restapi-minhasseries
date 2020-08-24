const express = require("express")
const app = express()
const port = 3000
const mongoose = require('mongoose')

const series = require('./routes/series')

app.use('/series',series)
//app.get('/series', (req, res) => res.send(series))

app.listen(port, () => console.log("app listening on port: ",port))