const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');

router.route('/').get(userController.getAllUsers).post(userController.addUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.editUser)
    .delete(userController.deleteUser);

module.exports = router;
