const Sequelize = require("sequelize");
// Após informar o usuário e a senha do banco , será efetuada a conexão com o seu banco de dados MySQL.
const connection = new Sequelize("casamentolei", "matricula", "Admin@pmp", {
    logging: false, // Retirar Log de Queris no ORM Sequelize
    host: "172.16.0.33",
    port: "5432",
    dialect: 'postgres',
    timezone: "-03:00",
  });
module.exports = connection;