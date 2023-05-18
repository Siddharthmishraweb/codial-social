const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res) {
   try {
     await Post.create({
       content: req.body.content,
       user: req.user._id
     });
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
  
    if(post.user == req.user.id){
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

