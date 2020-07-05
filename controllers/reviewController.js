const Review = require('../Models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.setTourUserID = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReview = handlerFactory.createOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
