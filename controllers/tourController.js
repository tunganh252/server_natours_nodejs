const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTour = (req, res, next) => {
  if (!req.query.limit) req.query.limit = '5';

  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage';
  next();
};

// ========== Aggregate pipe ========== //

exports.getStatisTours = catchAsync(async (req, res) => {
  const statis = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    // {
    //   $match: { _id: { $ne: 'DIFFICULTY' } },
    // },
    {
      $group: {
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsAverage' },
        avgRating: { $avg: '$ratingsAverage' },
        minRating: { $min: '$ratingsAverage' },
        maxRating: { $max: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgRating: -1 },
    },
  ]);

  res.status(200).json({
    Status: 'success',
    Code: 0,
    RequestTime: req.requestTime,
    Data: statis,
  });
});

exports.getMonthlyPlanFollowYear = catchAsync(async (req, res) => {
  const year = req.params.year * 1;

  const dataPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        nameTours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $sort: { numTourStarts: 1 },
    },
    {
      $limit: 5,
    },
  ]);

  res.status(200).json({
    Status: 'success',
    Code: 0,
    RequestTime: req.requestTime,
    Total: dataPlan.length,
    Data: dataPlan,
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
