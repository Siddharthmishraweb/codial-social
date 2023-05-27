const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   content:{
      type: String,
      required: true
   },
   user:{
      type:mongoose.Schema.Types.ObjectId,
      // refered to which Schema
      ref:'User'
   },
   // include the array of ids of all comments in this post schema itself
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
         // refered to which Schema
         ref:'Comment'
      }
   ],
   likes:[
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Like'
      }
   ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
