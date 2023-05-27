const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function(req, res) {
   try {
     let post = await Post.create({
       content: req.body.content,
       user: req.user._id
     });
     if(req.xhr){
       return res.status(200).json({
        data:{
          post: post
        },
        message: "Post Created!"
       });
     }
     req.flash('success', "Post Created !");
     return res.redirect('back');
   } catch (err) {
     console.log('Error in creating the post', err);
     return;
   }
}

module.exports.destroy = async function(req, res) {
  try{
    let post = await Post.findById(req.params.id);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5", post.user == req.user._id)
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5post", post.user.equals(req.user._id))
    if(post.user.equals(req.user._id)){
      // delete the associated likes for the post and all its comments like too
      await Like.deleteMany({likeable: post, onModel:'Post'});
      await Like.deleteMany({_id: {$in: post.comments}});

      await post.deleteOne(); // Updated code here
      req.flash('success', "Post Deleted !");
      await Comment.deleteMany({post: req.params.id}); 
      return res.redirect('back');
    }else{
      return res.redirect('back');
    }
  }catch(err){
    req.flash('error', "Post not Deleted !");
    console.log('Error occurs: ', err);
    return;
  }
}



// module.exports.destroy = function(req, res) {
//   Post.findById(req.params.id)
//     .then((post) => {
//       if (post.user == req.user.id) {
//         return Promise.all([
//           post.deleteOne(),
//           Comment.deleteMany({ post: req.params.id })
//         ]);
//       } else {
//         throw new Error('Unauthorized');
//       }
//     })
//     .then(() => {
//       return res.redirect('back');
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.redirect('back');
//     });
// };

