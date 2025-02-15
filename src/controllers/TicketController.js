const { Ticket, TicketType, User } = require('../models');
const sequelize = require('../config/database');

class TicketController {
  async index(req, res) {
    try {
      const tickets = await Ticket.findAll({
        where: { UserId: req.userId },
        include: [TicketType]
      });

      if (req.xhr) {
        return res.json(tickets);
      }
      return res.render('tickets/index', { tickets });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findOne({
        where: { id, UserId: req.userId },
        include: [TicketType]
      });

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      if (req.xhr) {
        return res.json(ticket);
      }
      return res.render('tickets/show', { ticket });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async purchase(req, res) {
    const t = await sequelize.transaction();

    try {
      const { ticketTypeId, quantity } = req.body;

      const ticketType = await TicketType.findByPk(ticketTypeId, { transaction: t });
      if (!ticketType) {
        await t.rollback();
        return res.status(404).json({ error: 'Ticket type not found' });
      }

      if (ticketType.quantity < quantity) {
        await t.rollback();
        return res.status(400).json({ error: 'Insufficient tickets available' });
      }

      const totalPrice = ticketType.price * quantity;

      const ticket = await Ticket.create({
        UserId: req.userId,
        TicketTypeId: ticketTypeId,
        quantity,
        totalPrice
      }, { transaction: t });

      await ticketType.update({
        quantity: ticketType.quantity - quantity
      }, { transaction: t });

      await t.commit();
      return res.status(201).json(ticket);
    } catch (error) {
      await t.rollback();
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TicketController();