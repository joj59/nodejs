const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'route not handled yet!',
    },
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'route not handled yet!',
    },
  });
};

exports.editUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'route not handled yet!',
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'route not handled yet!',
    },
  });
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
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});
