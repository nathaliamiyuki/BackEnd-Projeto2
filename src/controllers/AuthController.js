const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create({ name, email, password });
      user.password = undefined;

      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const validPassword = await user.checkPassword(password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      user.password = undefined;

      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      req.session.token = token;
      
      if (req.xhr) {
        return res.json({ user, token });
      }
      return res.redirect('/');
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
}

module.exports = new AuthController();