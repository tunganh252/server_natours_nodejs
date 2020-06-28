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

router.get(
  '/get-top-cheap',
  tourController.aliasTopTour,
  tourController.getAllTours
);

router.get('/statis-tours', tourController.getStatisTours);

router.get(
  '/get-monthly-plan/:year',
  authController.protect,
  authController.restricTo('ADMIN', 'LEAD_GUIDE', 'GUIDE'),
  tourController.getMonthlyPlanFollowYear
);

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
router.get(
  '/tours-within/:distance/center/:latlng/unit/:unit',
  tourController.getToursWithin
);

router.get('/distances/:latlng/unit/:unit', tourController.getDistances);

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
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restricTo('ADMIN', 'LEAD_GUIDE'),
    tourController.deleteTour
  );

module.exports = router;
