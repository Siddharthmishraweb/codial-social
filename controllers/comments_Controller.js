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
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue')

module.exports.create = async function(req, res) {
   try{
      let post = await Post.findById(req.body.post);

      if(post){
         let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
         })
         req.flash('success', "Comment Added!");
         post.comments.push(comment);
         post.save();
         comment = await Comment.populate(comment, { path: 'user', select: 'name email' });
         //commentsMailer.newComment(comment);
         let job = queue.create('emails', comment).save(function(err){
          if(err){console.log('Error in creating a queue', err); return;}
          console.log('Job Enqueued: ',job.id)
         })
         res.redirect('/');
      }
   }catch(err){
      req.flash('error', "Comment not Added!");
     console.log("Error: ", err);
     return;
   }
}

// module.exports.create = function(req, res) {
//    Post.findById(req.body.post)
//       .exec()
//       .then(post => {
//          if (!post) {
//             console.log('Post not found');
//             return;
//          }

//          Comment.create({
//             content: req.body.content,
//             post: req.body.post,
//             user: req.user._id
//          })
//             .then(comment => {
//                post.comments.push(comment);
//                return post.save();
//             })
//             .then(() => {
//                res.redirect('/');
//             })
//             .catch(err => {
//                console.log('Error creating comment:', err);
//             });
//       })
//       .catch(err => {
//          console.log('Error finding post:', err);
//       });
// };

module.exports.destroy = async function(req, res) {
   try {
     const comment = await Comment.findById(req.params.id);
     
     if (comment.user == req.user.id) {
       let postId = comment.post;
       await Comment.findByIdAndDelete(req.params.id);
       // destroy the associated likes for this comment
       await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
       
       req.flash('success', "Comment Deleted!");
       await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
       return res.redirect('back');
     } else {
       return res.redirect('back');
     }
   } catch (err) {
     req.flash('error', "Comment not deleted!");
     console.error(err);
     return res.redirect('back');
   }
 }
 
 