const fs = require('fs');

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'db',
    host: 'mariadb',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'db_test',
    host: 'mariadb-test',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};
