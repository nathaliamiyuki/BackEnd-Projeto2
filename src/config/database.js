const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Define o caminho do banco de dados usando variável de ambiente
const dbPath = path.join(__dirname, '..', '..', process.env.DB_PATH || 'data/database.sqlite');

// Garante que o diretório existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Remove arquivo corrompido do banco de dados se existir
try {
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
} catch (error) {
    console.error('Error removing corrupted database:', error);
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    }
});

module.exports = sequelize;