const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res) {
   try {
     const post = await Post.create({
       content: req.body.content,
       user: req.user._id
     });
     return res.redirect('back');
   } catch (err) {
     console.log('Error in creating the post', err);
     return;
   }
}

module.exports.destroy = function(req, res) {
  Post.findById(req.params.id)
    .then((post) => {
      if (post.user == req.user.id) {
        return Promise.all([
          post.deleteOne(),
          Comment.deleteMany({ post: req.params.id })
        ]);
      } else {
        throw new Error('Unauthorized');
      }
    })
    .then(() => {
      return res.redirect('back');
    })
    .catch((err) => {
      console.error(err);
      return res.redirect('back');
    });
};

