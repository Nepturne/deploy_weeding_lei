const Sequelize = require("sequelize");
const connection = require("../../database/database.js");

// Definição da Tabela
const Presente = connection.define("presente", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_produto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  valor_produto: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status_produto:{
    type: Sequelize.ENUM,
    values: ['Pago', 'Em pagamento'],
    allowNull: false,
  },
  falta: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  imagem: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Criação da TB de acordo com a Definição da Tabela no Model com:
//Presente.sync({ force: true });

module.exports = Presente;