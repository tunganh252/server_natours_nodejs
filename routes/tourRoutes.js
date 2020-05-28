const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// POST /tour/1239sdf8/reviews
// GET /tour/1239sdf8/reviews
// GET /tour/1239sdf8/reviews/172893sdf27348

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restricTo('USER', 'ADMIN'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/get-top-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route('/statis-tours').get(tourController.getStatisTours);

router
  .route('/get-monthly-plan/:year')
  .get(
    authController.protect,
    authController.restricTo('ADMIN', 'LEAD_GUIDE', 'GUIDE'),
    tourController.getMonthlyPlanFollowYear
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restricTo('ADMIN', 'LEAD_GUIDE'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restricTo('ADMIN', 'LEAD_GUIDE'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restricTo('ADMIN', 'LEAD_GUIDE'),
    tourController.deleteTour
  );

module.exports = router;
