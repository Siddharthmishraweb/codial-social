const express = require('express');
const router = express.Router();

const passport =  require('passport');

const userController = require('../controllers/users_controller');
router.get('/profile/:id',passport.checkAuthentication, userController.profile)
router.post('/update/:id',passport.checkAuthentication, userController.update)
// for sign In
router.get('/signIn', userController.signIn)
//console.log('******', passport)
router.get('/signUp', userController.signUp)

router.post('/create', userController.create);

//use passport as a middle ware to authenticate 
router.post('/create-session', passport.authenticate(
   'local',
   {failureRedirect: '/users/signIn'}
) , userController.createSession);

// for log out
router.get('/sign-out', userController.destroySession);

module.exports = router;