const STRIPE_SECRET_KEY =
  'sk_test_51Gz3IlLvhL2UfZ6F7bt3BZwaEMPu5axz6uI6NrwSuvMAMryYlVaCe5Oa1oq7gSwlJeZHuADmwlVTFzrSqBxI7TFw00KpGzeVy3';
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`http://207.148.69.27:8080/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3. Create session as response
  res.status(200).json({
    Status: 'success',
    Code: 0,
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is Temporary, because it's Unsecure: every one can make bookings without paying
  const {
    query: { tour, user, price },
  } = req;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
