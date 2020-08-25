const express = require("express") 
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const mongoose = process.env.MONGO || require('mongoose')
mongoose.Promise = global.Promise
const mongo = "mongodb://localhost/minhaserie-rest-devpleno"

const jwtSecret = "abc123abc"

//app.use(bodyParser({extended: true}))
app.use(bodyParser.json())
app.use(cors({
 origin: (origin, callback) =>{
    if(origin === 'http://server2:8080'){
      callback(null, true)
    }else{
      callback(new Error('NOT allowed by cors'))
    }
  }
}))

const User = require("./models/user")

const series = require('./routes/series')
const users = require('./routes/users')

app.use('/series',series)
//app.get('/series', (req, res) => res.send(series))
app.use('/users', users)

app.post('/auth', async(req, res) =>{
  const user = req.body
  const userDb = await User.findOne({username: user.username})
  if(userDb){
    if(userDb.password === user.password){
      const payload = {
        id: userDb._id, 
        username: userDb.username, 
        roles: userDb.roles
      }
      jwt.sign(payload, jwtSecret, (err, token) => {
        res.send({
          success: true, 
          token: token
        })
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
