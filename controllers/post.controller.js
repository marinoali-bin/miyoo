const PostModel = require('../models/post.model')
const UserModel = require('../models/user.model')
const ObjectID = require('mongoose').Types.ObjectId
const { promisify } = require('util') 
const { uploadErrors } = require('../utils/errors.utils')
const pipeline = promisify(require("stream").pipeline )
const fs = require("fs")


// SHOW READ ALL POSTS
module.exports.readPost = async (req,res)=>{
      PostModel.find((err, docs)=>{

            if(!err) res.send(docs) 
            else console.log('Error to get Data '+ err);
      }).sort({createdAt: -1})
}


// CREATE POST
module.exports.createPost = async (req,res)=>{

      let fileName

      if (req.file !==  null){

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

            fileName = req.body.posterId + Date.now() + '.jpg'

            await pipeline(
                  req.file.stream,
                  fs.createWriteStream( `${__dirname}/../client/public/uploads/posts/${fileName}`)
            )

      }

      const newPost = new PostModel({ 
            posterId : req.body.posterId,
            message : req.body.message,
            picture : req.file !== null ? "./uploads/posts/" + fileName : "",
            video : req.body.video,
            likers:[],
            comments:[] 
      })
      try{
            post = await newPost.save()
            return res.status('201').json(post)
      }catch(err){
            return res.status('400').send(err)
      }
}

//  UPDATE POST
module.exports.updatePost = async (req,res)=>{
      if(!ObjectID.isValid(req.params.id))
      return res.status(400).send('ID unknown : ' + req.params.id );

      PostModel.findByIdAndUpdate(
            req.params.id,
            {
                  $set: { message: req.body.message }
            },
            { new: true},
            (err,docs)=>{
                  if(!err) res.json(docs)
                  else console.log('Update Error '+ err);
            }
      )
}

// DELETE POST
module.exports.deletePost = async (req, res) => {

      if(!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id );

      PostModel.findByIdAndRemove( req.params.id, (err, docs) => {
                        if(!err) res.send(docs)
                        else console.log("Delete Error" + err);
                  }
             )
}



// LIKE POST
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id)

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs)
        else return res.status(400).send(err)
      }
    );
  } catch (err) {
    return res.status(400).send(err)
  }
}


// UNLIKE POST
module.exports.unlikePost = async (req,res)=>{
      if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id)

      try{
            await PostModel.findByIdAndUpdate(
                  req.params.id,
                  { $pull: { likers : req.body.id } },
                  { new:true },
                  (err, docs)=>{
                        if (err) return res.status(400).send(err);
                        }
            )

            await UserModel.findByIdAndUpdate(
                  req.body.id,
                  { 
                        $pull: { likes : req.params.id }
                  },
                  { new : true },
                  (err, docs)=>{
                        if(!err) res.send(docs)
                        else return res.status(400).send(err)
                        }
            )

      } catch (err){ return res.status(400).send(err) }
}


// comments

module.exports.commentPost = async (req, res)=>{
      if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id)

      try{
            PostModel.findByIdAndUpdate(
                  req.params.id,
                  {
                        $push: {
                              comments :{
                                    commenterId : req.body.commenterId,
                                    commenterPseudo : req.body.commenterPseudo,
                                    text: req.body.text,
                                    timeStamp : new Date().getTime()
                              }
                        }
                  },
                  { upsert: true, new: true },
                  (err, docs)=>{
                        if (!err) res.send(docs)
                        else return res.status(400).send(err)
                  }
            )
      }catch(err){
            return res.status(400).send(err)
      }
}

module.exports.editCommentPost = async ( req, res ) => {
      if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id)

      try{
             PostModel.findById(
                  req.params.id,
                  (err, docs)=>{

                        const theComment = docs.comments.find( (comment) => (
                              comment._id.equals( req.body.commentId )
                        ))

                        if (!theComment) return res.status(404).send("Comment not found")
                        else theComment.text = req.body.text

                        return docs.save((err)=>{
                              if (!err) return res.status(200).send(docs)
                              else return res.status(500).send(err)
                        })
                  }
                  )

      }catch(err){
            return res.status(400).send(err)
      }
}

module.exports.deleteCommentPost = (req, res)=>{
      if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id)

      try{
            PostModel.findByIdAndUpdate(req.params.id,
                        {
                              $pull :{
                                     comments : { _id : req.body.commentId}
                              }
                        },
                        { new:true },
                        (err, docs) =>{
                              if (err) return res.status(400).send(err)
                              else return res.status(200).send(docs)
                        }
                  )

      }catch(err){
            res.status(400).send(err)
      }

}
