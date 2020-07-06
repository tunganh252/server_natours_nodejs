const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

//////////////
// UPLOAD FILE
//////////////

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const message = 'Not an image! Please upload only images.';
    cb(new AppError(400, -1, message));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // const ext = req.file.mimetype.split('/')[1]; // .jpeg || .png .....

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  // console.log(req.file);
  // console.log(req.body);

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

  if (req.file) {
    filterBody.photo = req.file.filename;
  }

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
