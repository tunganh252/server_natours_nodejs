const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedInClient,
  viewController.getOverview
);

router.get(
  '/tour/:slug',
  authController.isLoggedInClient,
  viewController.getTour
);

router.get('/login', authController.isLoggedInClient, viewController.loginForm);

router.get('/account', authController.protect, viewController.getAccount);

router.post(
  '/submit-update-user',
  authController.protect,
  viewController.submitUpdateUser
);

module.exports = router;
