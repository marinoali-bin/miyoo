module.exports.signUpErrors = (err) => {
      let errors = { pseudo:"", email:"", password:"" };

            if(err.message.includes('pseudo')) errors.pseudo = "Pseudo incorrecte ou déja pris"

            if(err.message.includes('email')) errors.email = "Email incorrecte"

            if(err.message.includes('password')) errors.password = "Mot de passe doit faire 6 caracteres min"

            if(err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo") )
            errors.pseudo = 'Ce pseudo est déjà enregistré'
            
            if(err.code == 11000 && Object.keys(err.keyValue)[0].includes("email") )
            errors.email = 'Cet email est déjà enregistré'
            
      return errors
}

module.exports.signInErrors = (err) => {

      let errors = {email:"",password:""}

      if(err.message.includes('email'))
      errors.email="L'email est incorrect"
      
      if(err.message.includes('password'))
      errors.password="Le mot de passe ne correspond pas"
      
      return errors  
}

module.exports.uploadErrors = (err) =>{

      let errors = { format : "", maxSize: ""}

      if ( err.message.includes('invalid file'))
      errors.format = "Format incompatible"

      if ( err.message.includes('max size'))
      errors.maxSize = "Le fichier dépasse 500ko"

      return errors
}