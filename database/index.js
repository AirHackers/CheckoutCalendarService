const mysql = require('mysql');
const createData = require('./fixtures');
const database = 'reservations';

const connection = mysql.createConnection({
  user: 'root',
  password: ''
});

// Use promisification on the MySQL database connection
const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}`))
  .then(() => createData(db));

module.exports = db;
