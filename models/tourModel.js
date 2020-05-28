const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./../models/userModel');

const tourSchema = new mongoose.Schema(
  {
    slugTest: String,
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 characters'],
      minlength: [10, 'A tour name must have more or equal 10 characters'],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name must only contain characters', // not number, space between characters
      // ],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficulty',
      },
      validate: [
        validator.isAlpha,
        'Tour name must only contain characters', // not number, space between characters
      ],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsqQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; //
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },

  //  this object to access to create virtual properties
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 *@description: Virtual properties
 */
tourSchema.virtual('durationsOnWeek').get(function () {
  if (!this.duration) return null
  return `${this.duration / 7} week`;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

/**
 *@description: Document Middleware: runs before .save() and .create()
 */
tourSchema.pre('save', function (next) {
  this.slugTest = slugify(this.name, {
    lower: true,
  });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(11111, doc);
//   console.log('Document just save');
//   next();
// });

/* -------------------------------------------------------------------------- */
/*                         // End Document Middleware                         */
/* -------------------------------------------------------------------------- */

/**
 *@description: Query Middleware
 */

// tourSchema.pre(/^find/, function (next) {
//   // this.find({ secretTour: { $ne: true } });
//   // console.log('Query Middleware');
//   this.start = new Date();
//   next();
// });__v

/**
 *@description: Aggreration Middleware
 */
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
