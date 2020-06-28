const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middlewares
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get(
  '/currentUser',
  userController.getCurrentUser,
  userController.getUser
);

router.patch(
  '/updateCurrentUser',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateCurrentUser
);

router.delete('/deactiveCurrentUser', userController.deactiveCurrentUser);

// Retristo all routes with role ADMIN after this middlewares
router.use(authController.restricTo('ADMIN'));

router.get('/', userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.restricTo('ADMIN'), userController.deleteUser);

module.exports = router;
