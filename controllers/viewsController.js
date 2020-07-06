const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // 1. Get Tour data from collections
  const tours = await Tour.find();
  // 2. Build template
  // 3. Render template using data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get data for requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError(404, -1, 'There is no tour with that name.'));
  }
  // 2. Build template
  // 3. Render template using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.loginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login User Account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account User',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find all bookings
  const booking = await Booking.find({ user: req.user.id });
  // 2. Find tours with returned ID
  const tourIDs = booking.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.submitUpdateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Account User',
    user,
  });
});
