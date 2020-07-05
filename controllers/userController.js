const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.editUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'route not handled yet! please use /signup route instead',
    },
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.params.id);

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates, use update passwords',
        400
      )
    );
  }

  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});
