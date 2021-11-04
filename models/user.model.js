const mongoose = require('mongoose');
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
      {
            pseudo:{
                  type: String,
                  required: true,
                  minLength:3,
                  maxlength:55,
                  unique: true,
                  trim: true
            },
            email:{
                  type: String,
                  required: true,
                  validate:[isEmail],
                  unique: true,
                  lowercase: true,
                  trim: true
            },
            password:{
                  type: String,
                  required: true,
                  max:1024,
                  minlength:6
            },
            picture:{
                  type: String,
                  default: "../client/public/uploads/profil/random-user.png"
            },
            bio:{
                  type: String,
                  max:1024,
            },
            followers:{ type: [String] },
            following:{ type: [String] },
            likes:{ type: [String] }
      },
      {
            timestamps: true
      }
)

// Cette foncition hashes le mot de passe just avant d'envonyer la requete, Att. ne pas utitliser les funcionts flechées
userSchema.pre('save', async function(next){
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt)
      next()
})
//--------------------------------------------------------


userSchema.statics.login = async function(email, password){

      const user = await this.findOne({email})

      if (user){
            const auth = bcrypt.compare(password, user.password)

            if(auth){
                  return user
            } throw Error ('Mot de Passe Incorrect')

      }throw Error ('Email Incorrect')

}

const User = mongoose.model('user', userSchema )

module.exports = User;