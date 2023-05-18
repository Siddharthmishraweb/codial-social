const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = function (req, res) {
  Post.find({})
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    .exec()
    .then(posts => {
      return User.find({}).exec()
        .then(users => {
          res.render('home', {
            title: 'Codial Home',
            posts: posts,
            all_users: users
          });
        });
    })
    .catch(err => {
      // Handle the error
      console.error(err);
      // Render an error page or return an error response
      res.status(500).send('Internal Server Error');
    });
};







// module.exports.home = async function(req, res) {
//    try {
//      const posts = await Post.find({})
//      .populate('user')
//      .populate({
//        path: 'comments',
//        populate:{
//         path:'user'
//        }

//      })
//      .exec();
//      return res.render('home', {
//        title: 'Codial | Home',
//        posts: posts
//      });
//    } catch (err) {
//      console.log('Error in fetching posts from database', err);
//      return;
//    }
//  }
 
 
