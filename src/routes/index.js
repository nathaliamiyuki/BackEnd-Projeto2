const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');

const authRoutes = require('./auth');
const ticketRoutes = require('./tickets');
const ticketTypeRoutes = require('./ticketTypes');

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/ticket-types', ticketTypeRoutes);

router.get('/', authMiddleware, (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

module.exports = router;