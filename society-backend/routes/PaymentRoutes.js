// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

router.get('/', verifyToken, paymentController.getPayments);
router.post('/', verifyToken, verifyRole("resident"), paymentController.createPayment);
router.put('/:id', verifyToken, verifyRole("resident"), paymentController.updatePayment);
router.delete('/:id', verifyToken, verifyRole("resident"), paymentController.deletePayment);

module.exports = router;
