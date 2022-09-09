const Sequelize = require("sequelize");
// Após informar o usuário e a senha do banco , será efetuada a conexão com o seu banco de dados MySQL.
const connection = new Sequelize("casamentolei", "root", "root", {
    logging: false, // Retirar Log de Queris no ORM Sequelize
    host: "localhost",
    port: "3306",
    dialect: 'mysql',
    timezone: "-03:00",
  });
module.exports = connection;