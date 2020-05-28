const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFiels) => {
  const newObject = {};
  Object.keys(obj).forEach((item) => {
    if (allowedFiels.includes(item)) {
      newObject[item] = obj[item];
    }
  });
  return newObject;
};

exports.getCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  // 1. Create error if user POST password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        400,
        -1,
        'This route is not for password updates. Please use /updateMyPassword'
      )
    );
  }

  // 2. Filter out unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(req.body, 'name', 'email');
  // console.log(filterBody);

  // 3. Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  // console.log(updateUser);

  res.status(200).json({
    Status: 'success',
    Code: 0,
    data: updateUser,
  });
});

/**
 * @description: Exactly is change status active account ----> false
 */
exports.deactiveCurrentUser = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    Status: 'success',
    Code: 0,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
