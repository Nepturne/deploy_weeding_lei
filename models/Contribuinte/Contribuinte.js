const Sequelize = require("sequelize");
const connection = require("../../database/database.js");

// Definição da Tabela
const Contribuinte = connection.define("contribuinte", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  codigo_acesso:{
    type: Sequelize.ENUM,
    // Caso seja padrinho : CODPALUEI
    // Caso seja convidado: CONVLEI
    values: ['Padrinho', 'Convidado'],
    allowNull: true,
  },
  nome_produto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nome_contrib: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  telefone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  valor_contrib: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

// Criação da TB de acordo com a Definição da Tabela no Model com:
Contribuinte.sync({ force: true });

module.exports = Contribuinte;