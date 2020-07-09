const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckoutSession
);

router
  .route('/')
  .get(authController.protect, bookingController.getAllBookings)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.addBooking
  );

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.editBooking
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.deleteBooking
  );
module.exports = router;
