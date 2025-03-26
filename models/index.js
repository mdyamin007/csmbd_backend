const { Sequelize } = require('sequelize');
const config = require('../config/database').development; 
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

// Import models
const User = require('./User')(sequelize);
const Content = require('./Content')(sequelize);

// Associations
User.hasMany(Content, { foreignKey: 'userId', as: 'contents' });
Content.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Content };
