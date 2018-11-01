const mysql = require('mysql');
const Promise = require('bluebird');
const seedData = require('./fixtures.js');

const database = 'reservations';

const connection = mysql.createConnection({
  user: 'root',
  password: '',
});

// Use promisification on the MySQL database connection
const db = Promise.promisifyAll(connection, { multiArgs: true });

// Almost the same as the index script, except no exports and will exit when it finishes.
db.connectAsync()
  .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}`))
  .then(() => db.queryAsync(`USE ${database}`))
  .then(() => seedData(db))
  .then(() => process.exit(0));
