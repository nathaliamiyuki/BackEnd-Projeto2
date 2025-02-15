const express = require('express');
const router = express.Router();
const TicketTypeController = require('../controllers/TicketTypeController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', TicketTypeController.index);

router.use(authMiddleware, adminMiddleware);

router.post('/', TicketTypeController.store);
router.put('/:id', TicketTypeController.update);
router.delete('/:id', TicketTypeController.destroy);

module.exports = router;