const mysql = require('mysql');
const Promise = require('bluebird');
const seedData = require('./fixtures.js');

const database = 'reservations', table = database;

const connection = mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  password: '',
});

// Use promisification on the MySQL database connection
const db = Promise.promisifyAll(connection, { multiArgs: true });

// Almost the same as the index script, except no exports and will exit when it finishes.
db.connectAsync()
  .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}, seeding database...`))
  .then(() => db.queryAsync(`DROP DATABASE IF EXISTS ${database}`))
  .then(() => db.queryAsync(`CREATE DATABASE ${database}`))
  .then(() => db.queryAsync(`USE ${database}`))
  .then(() => db.queryAsync(`CREATE TABLE IF NOT EXISTS ${table} (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nights INTEGER NOT NULL,
    guests INTEGER NOT NULL,
    price INTEGER NOT NULL,
    startDate INTEGER NOT NULL,
    endDate INTEGER NOT NULL,
    homeId INTEGER NOT NULL)`
   ))
  .then(() => seedData(db))
  .then(() => process.exit(0));
