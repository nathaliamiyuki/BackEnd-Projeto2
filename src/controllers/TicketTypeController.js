const { TicketType } = require('../models');

class TicketTypeController {
  async index(req, res) {
    try {
      const ticketTypes = await TicketType.findAll();
      
      if (req.xhr) {
        return res.json(ticketTypes);
      }
      return res.render('ticketTypes/index', { ticketTypes });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, price, quantity } = req.body;
      const ticketType = await TicketType.create({ name, price, quantity });
      return res.status(201).json(ticketType);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, quantity } = req.body;

      const ticketType = await TicketType.findByPk(id);
      if (!ticketType) {
        return res.status(404).json({ error: 'Ticket type not found' });
      }

      await ticketType.update({ name, price, quantity });
      return res.json(ticketType);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const ticketType = await TicketType.findByPk(id);
      
      if (!ticketType) {
        return res.status(404).json({ error: 'Ticket type not found' });
      }

      await ticketType.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TicketTypeController();