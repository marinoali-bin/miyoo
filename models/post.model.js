const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
      posterId: {
            type: String,
            require:true
      },
      message:{
            type: String,
            require: true,
            maxlength: 500
      },
      likers:{
            type: [String]
      },
      picture:{
            type: [String]
      },
      video:{
            type: [String]
      },
      comments:{
            type: [
                        {
                        commenterId: String,
                        commenterPseudo: String,
                        text: String,
                        timeStamp: Number
                  }
            ],
            //require: true
      },
},
{
      timeStamps: true
})

module.exports = mongoose.model('post', PostSchema )

