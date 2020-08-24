const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require("body-parser")

const mongoose = process.env.MONGO || require('mongoose')
mongoose.Promise = global.Promise
const mongo = "mongodb://localhost/minhaserie-rest-devpleno"

//app.use(bodyParser({extended: true}))
app.use(bodyParser.json())

const series = require('./routes/series')
const User = require("./models/user")

app.use('/series',series)
//app.get('/series', (req, res) => res.send(series))

app.post('/auth', async(req, res) =>{
  const user = req.body
  const userDb = await User.findOne({username: user.username})
  if(userDb){
    if(userDb.password === user.password){
      res.send({
        success: true, 
        username: userDb.username,
        token: ''
      })
    }else{
      res.send({success: false, message: "wrong credentials"})
    }
  }else{
    res.send({success: false, message:'wrong credentials'})
  }
  //res.send(user)
})

const createInitialUsers = async() => {
  const total = await User.count({})
  if(total === 0){
    const user = new User({
      username: 'gui',
      password: '123456',
      roles:['restrito', 'admin']
    })
    await user.save()

    const user2 = new User({
      username: 'restrito',
      password: '123456',
      roles:['restrito']
    })
    await user2.save()
  }
}

mongoose.connect(mongo, {useMongoClient: true})
.then(()=> {
  createInitialUsers()
  app.listen(port, () => console.log("app listening on port: ",port))
})
.catch(e => console.log(e))
