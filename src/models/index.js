const User = require('./User');
const TicketType = require('./TicketType');
const Ticket = require('./Ticket');

// Relationships
User.hasMany(Ticket);
Ticket.belongsTo(User);

TicketType.hasMany(Ticket);
Ticket.belongsTo(TicketType);

module.exports = {
    User,
    TicketType,
    Ticket
};