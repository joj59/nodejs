const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect);

router.route('/updateMyPassword').patch(authController.updatePassword);
router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
