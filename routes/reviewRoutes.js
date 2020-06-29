const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middlewares
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restricTo('USER', 'ADMIN'),
    reviewController.setToursIDs,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(authController.restricTo('USER', 'ADMIN'), reviewController.getReview)
  .patch(
    authController.restricTo('USER', 'ADMIN'),
    reviewController.updateReview
  )
  .delete(
    authController.restricTo('USER', 'ADMIN'),
    reviewController.deleteReview
  );

module.exports = router;
