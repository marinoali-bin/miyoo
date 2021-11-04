const UserModel = require('../models/user.model')
const fs = require("fs")
const { promisify } = require('util')  // nous permet de controller les
const { uploadErrors } = require('../utils/errors.utils')
const pipeline = promisify(require("stream").pipeline )

module.exports.uploadProfil = async(req,res) => {

      // 1. On controle le format et la taille de l'image

      try{
            if (  req.file.detectedMimeType !=  "image/jpg" &&
                  req.file.detectedMimeType !=  "image/png" &&
                  req.file.detectedMimeType !=  "image/jpeg" 
            )
            throw Error("invalid file")

            if ( req.file.size > 500000 ) throw Error("max size")

      }catch(err){
            const errors = uploadErrors(err)
            return res.status(201).json({errors})
      }

      // 2. On télécharge l'image dans un dossier

      const fileName = req.body.name + ".jpg"

      await pipeline(
            req.file.stream,
            fs.createWriteStream( `${__dirname}/../client/public/uploads/profil/${fileName}`)
      )

      // 3. On enregistre le chemin de lîmage dans la bd

      try {
            await UserModel.findByIdAndUpdate(
                  req.body.userId,
                  {
                        $set: { picture : "./uploads/profil/" + fileName }
                  },
                  {new : true, upsert : true, setDefaultsOnInsert: true },
                  (err, docs)=>{
                        if(!err) res.send(docs)
                        else return res.status(500).send({ message : err })
                  }
            )
      } catch (err) {
            return res.status(500).send({message : err })
      }

}