const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const {signUpErrors, signInErrors} = require('../utils/errors.utils')



module.exports.signUp = async (req,res) => {

      const {pseudo, email, password} = req.body;
      //console.log(req.body);
      try{
            const user = await UserModel.create({pseudo, email,password})
            res.status(201).json({user: user._id})
      }catch(err){
            const errors = signUpErrors(err)
                  res.status(200).send({errors})
                  console.log(errors);
            } 
      
}



const maxAge = 3 * 24 * 60 * 60 * 1000 // valable 3 jours en ms

const createToken = (id)=>{
      return jwt.sign({id},process.env.TOKEN_SECRET, {
            expiresIn: maxAge
      })
}

module.exports.signIn = async (req,res) => {

      const {email, password} = req.body ;

            try{
                  const user = await UserModel.login(email, password)
                  const token = createToken(user._id)
                  res.cookie('jwt', token, {httpOnly: true, maxAge} ) // nom du cookie est jwt
                  res.status(200).json({user : user._id})
            }
            catch(err){
                  signInErrors(err)
                  res.status(200).json(err.message)
            }
}

module.exports.logout =  (req,res) => {

      res.cookie('jwt','', {maxAge : 1} ) // 1ms de temps de vie
      res.redirect('/')

}
