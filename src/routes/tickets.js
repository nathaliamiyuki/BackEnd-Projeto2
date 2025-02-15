const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', TicketController.index);
router.get('/:id', TicketController.show);
router.post('/purchase', TicketController.purchase);

module.exports = router;