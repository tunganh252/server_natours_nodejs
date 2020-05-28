const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

dotenv.config({ path: './../config.env' });

const startTime = new Date();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

/**
 * @description: 2 option: connect cloud db || connect local db
 */
mongoose
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      'connect database successfully',
      `-----Time Finish ${new Date() - startTime}ms`
    );
  });

const tours = JSON.parse(fs.readFileSync('./data/tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf-8'));

/**
 * @example: node tools.js --import
 */
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log(
      'import data success',
      `-----Time Finish ${new Date() - startTime}ms`
    );
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

/**
 * @example: node tools.js --delete
 */
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log(
      'delete data success',
      `-----Time Finish ${new Date() - startTime}ms`
    );
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();

console.log(process.argv);
