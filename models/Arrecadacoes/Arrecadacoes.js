const Sequelize = require("sequelize");
const connection = require("../../database/database.js");

// Definição da Tabela
const Arrecadacoes = connection.define("arrecadacoes", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nome:{
    type: Sequelize.STRING,
    allowNull: false
  },
  nome_produto:{
    type: Sequelize.STRING,
    allowNull: false  
  },
  status:{
    type: Sequelize.ENUM,
    values: ['Falta', 'Finalizado'],
    allowNull: false,
  },
  tipo_contrib:{
    type: Sequelize.ENUM,
    values: ['Pix', 'Boleto'],
    allowNull: false,
  },
  cont_whats_contrib:{
    type: Sequelize.STRING,
    allowNull: false  
  },
  valor_presente: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

// Criação da TB de acordo com a Definição da Tabela no Model com:
Arrecadacoes.sync({ force: true });

module.exports = Arrecadacoes;

