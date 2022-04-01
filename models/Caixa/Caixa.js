const Sequelize = require("sequelize");
const connection = require("../../database/database.js");

// Definição da Tabela
const Caixa = connection.define("caixa", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  valor_caixa: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
    allowNull: false,
  },
});

// Criação da TB de acordo com a Definição da Tabela no Model com:
//Caixa.sync({ force: true });

module.exports = Caixa;

