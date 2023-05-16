// const { response } = require('express');
// const Comment = require('../models/comment');
// const Post = require('../models/post');

// module.exports.create = function(req, res){
//    Post.findById(req.body.post, function(err, post){
//       if(err) { console.log("Error in finding in post: ", err) ;return;}
//       if(post){
//          Comment.create({
//             content: req.body.content,
//             post: req.body.post,
//             user: req.user._id
//          }, function(err, comment){
//                if(err) { console.log("Error in finding in post: ", err) ;return;}
//                post.comments.push(comment);
//                post.save();
//                response.redirect('/')
//          })
//       }
//    })
// }


const { response } = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res) {
   Post.findById(req.body.post)
      .exec()
      .then(post => {
         if (!post) {
            console.log('Post not found');
            return;
         }

         Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
         })
            .then(comment => {
               post.comments.push(comment);
               return post.save();
            })
            .then(() => {
               res.redirect('/');
            })
            .catch(err => {
               console.log('Error creating comment:', err);
            });
      })
      .catch(err => {
         console.log('Error finding post:', err);
      });
};
