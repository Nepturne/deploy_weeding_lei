const Sequelize = require("sequelize");
// Após informar o usuário e a senha do banco , será efetuada a conexão com o seu banco de dados MySQL.
const connection = new Sequelize("heroku_9e07b5415c45e9c", "b07230eae350ef", "25234154", {
    logging: false, // Retirar Log de Queris no ORM Sequelize
    host: "us-cdbr-east-06.cleardb.net",
    port: "3306",
    dialect: 'mysql',
    timezone: "-03:00",
  });
module.exports = connection;