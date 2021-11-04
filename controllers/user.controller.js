const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.getAllUsers = async (req, res) =>{
      const users = await UserModel.find().select('-password');  // ne renvoi pas le mot de passe au front stp
      res.status(200).json(users)
}

module.exports.userInfo = async (req,res) => {
      //console.log(req.params);

      // controle si ID est contenu dans db
      if(!ObjectID.isValid(req.params.id))
            return res.status(400).send('ID unknown : ' + req.params.id)
      
            UserModel.findById(req.params.id, (err, docs)=>{
                  if (!err) res.send(docs)
                  else console.log('ID unknown : '+ err);
            }).select('-password')
}

module.exports.updateUser = async (req,res) =>{

      // controle si ID est contenu dans db
      if(!ObjectID.isValid(req.params.id))
            return res.status(400).send('ID unknown : ' + req.params.id)

      try{
            UserModel.findOneAndUpdate(
                  { _id : req.params.id},
                  {
                        $set: {
                              bio : req.body.bio
                        }
                  },
                  { new:true, upsert:true,setDefaultsOnInsert:true },
                  (err,docs)=>{
                        if (!err) res.send(docs)
                        if (err) res.status(500).send( {message : err.message})
                  }
            )
      }catch(err){ 
            res.send( {message : err}) 
      }

}

// Delete user

module.exports.deleteUser = async (req, res) => {

      if(!ObjectID.isValid(req.params.id))
            return res.status(400).send('ID unknown : ' + req.params.id)
      
      try{
           await UserModel.remove({_id : req.params.id }).exec()
           res.status(200).json({message: "Succesfully deleted"})
      }
      catch(err){
            return res.status(500).json({message : err.message})
      }
      
}


// FOLLOW
 
module.exports.follow = async(req, res) => {

      if(!ObjectID.isValid(req.params.id)  || !ObjectID.isValid(req.body.idToFollow) )
            return res.status(400).send('ID unknown : ' + req.params.id );
      
      try {
            // Ajouter à ma liste des follower
            await UserModel.findByIdAndUpdate( 
                  req.params.id,
                  { $addToSet: { following: req.body.idToFollow }},
                  { new: true, upsert: true },
                  (err, docs) => {
                        if(!err) res.status(201).json(docs)  
                        else return res.status(400).json(err)    
                  }     
            )

             // S'ajouter a la liste des personnes suivis par la cible
            await UserModel.findByIdAndUpdate(
                   req.body.idToFollow,
                  { $addToSet: { followers : req.params.id }},
                  { new: true, upsert: true },
                  (err, docs ) => {
                        if (err) res.status(400).json(err)
                  }
            )


      } catch (error) {
            return res.status(500).json({ message : error.message }) 
      }

}


// UNFOLLOW
 
module.exports.unfollow = async(req, res) => {

      if(!ObjectID.isValid(req.params.id)  || !ObjectID.isValid(req.body.idToUnFollow) )
            return res.status(400).send('ID unknown : ' + req.params.id );
      
      try {
            // Ajouter à ma liste des follower
            await UserModel.findByIdAndUpdate( 
                  req.params.id,
                  { $pull: { following: req.body.idToUnFollow }},
                  { new: true, upsert: true },
                  (err, docs) => {
                        if(!err) res.status(201).json(docs)  
                        else return res.status(400).json(err)    
                  }     
            )

             // S'ajouter a la liste des personnes suivis par la cible
            await UserModel.findByIdAndUpdate(
                   req.body.idToUnFollow,
                  { $pull: { followers : req.params.id }},
                  { new: true, upsert: true },
                  (err, docs ) => {
                        if (err) res.status(400).json(err)
                  }
            )


      } catch (error) {
            return res.status(500).json({ message : error.message }) 
      }

}