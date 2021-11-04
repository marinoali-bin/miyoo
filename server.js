const express = require ('express');
const userRoutes = require('./routes/user.routes')
const postRoutes = require('./routes/post.routes')
//const bodyParser = require('body-parser')
require('dotenv').config({path: './config/.env'})
require ('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware')
//rsrequire('./api/user')
const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors')


const corsOptions = {
      origin: process.env.CLIENT_URL,
      credentials: true,
      'allowedHeaders': ['sessionId', 'Content-Type'],
      'exposedHeaders': ['sessionId'],
      'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'preflightContinue': false
    }

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({corsOptions}))
app.use(express.json()) ;
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()) ;

//jwt
app.get('*', checkUser  ) ;
app.get('/jwtid', requireAuth, (req,res)=>{
      res.status(200).send(res.locals.user._id)
})


//ROUTES

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);



//SERVER
app.listen(process.env.PORT, ()=>{
      console.log(`Listening on port ${process.env.PORT}`);
})