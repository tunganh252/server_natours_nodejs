const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middlewares
router.use(authController.protect);

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);
router
  .route('/currentUser')
  .get(userController.getCurrentUser, userController.getUser);
router.route('/updateCurrentUser').patch(userController.updateCurrentUser);
router.route('/deactiveCurrentUser').delete(userController.deactiveCurrentUser);

// Retristo all routes with role ADMIN after this middlewares
router.use(authController.restricTo('ADMIN'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restricTo('ADMIN'),
    userController.deleteUser
  );

module.exports = router;
