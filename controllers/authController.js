const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const _createSendToken = (type) => (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'PRODUCTION') {
    cookieOptions.sercure = true;
  }

  res.cookie('cookie_user', token, cookieOptions);

  res.status(statusCode).json({
    Status: 'success',
    Code: 0,
    Token: type === 'login' ? token : undefined,
    data:
      user.role === 'ADMIN'
        ? user
        : {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const _createSendTokenToSignup = _createSendToken('signup');
  _createSendTokenToSignup(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check email and password exits
  if (!email || !password) {
    const message = 'Please provider email and password!';
    return next(new AppError(400, -1, message));
  }
  // 2. Check if user email && password is correct
  const user = await User.findOne({ email }).select('+password');
  let correctPassword = null;
  if (user) {
    correctPassword = await user.correctPassword(password, user.password);
  }
  // console.log('user', user);
  // console.log('correctPassword', correctPassword);

  if (!user || !correctPassword) {
    const message = 'Incorrect email or password!';
    return next(new AppError(401, -1, message));
  }

  // 3. If everything ok --> send token to client
  const _createSendTokenToLogin = _createSendToken('login');
  _createSendTokenToLogin(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  // 1. Getting token and check of it's there
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const message = 'You are not login! Please login to get access.';
    return next(new AppError(401, -1, message));
  }

  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exits
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    const message = 'The user belonging to this token does not longer exist.';
    return next(new AppError(401, -1, message));
  }

  // 4. Check if user changed password after the token was issued
  const checkUserChangedPassword = currentUser.changedPasswordAfter(
    decoded.iat
  );
  if (checkUserChangedPassword) {
    const message = 'User recently changed password! Please login again.';
    return next(new AppError(401, -1, message));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    // Roles = ['ADMIN', 'LEAD_GUIDE'] | Role = "USER"
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      const message = "You don't have permission to perform this action";
      return next(new AppError(403, -1, message));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on Post email

  const user = await User.findOne({ email: req.body.email });
  console.log('user:', user);

  if (!user) {
    const message = 'There is no user with email address';
    return next(new AppError(400, -1, message));
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  // 3. Send it to user's email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  console.log(2222, resetURL);

  const message = `Forgot your password? Submit a PATCH request with your new passowrd and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset Token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      Status: 'success',
      Message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);

    return next(
      new AppError(
        400,
        -1,
        'There was an error sending the email. Try again later!'
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and the is user, set the new password
  if (!user) {
    return next(new AppError(400, -1, 'Token is invalid or has expired'));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3. Update changedPasswordAt property for the user
  // Run in userModel (document middlewares)

  // 4. Log the user, send JWT
  const _createSendTokenToSignup = _createSendToken('resetPassword');
  _createSendTokenToSignup(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2. Check if POST current password correct
  const correctPassword = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );
  if (!correctPassword) {
    return next(new AppError(401, -1, 'Your current password is wrong.'));
  }

  // 3. If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended

  // 4. Login user, send JWT
  const _createSendTokenToSignup = _createSendToken('updatePassword');
  _createSendTokenToSignup(user, 200, res);
});
