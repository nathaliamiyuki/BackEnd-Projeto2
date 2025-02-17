const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.create({ name, email, password });
            return res.redirect('/login');
        } catch (error) {
            return res.render('register', { error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.render('login', { error: 'Usuário não encontrado' });
            }

            const token = jwt.sign(
                { id: user.id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1d' }
            );

            req.session.token = token;
            return res.redirect('/');
        } catch (error) {
            return res.render('login', { error: error.message });
        }
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}

module.exports = new AuthController();