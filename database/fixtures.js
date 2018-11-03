// Populate the database with mock data.
// For each row, create a random number of nights and guests,
// and use the # of nights to calculate the start and end dates

const seedData = (db) => {
  const ROWS = 100;
  const SEC_IN_DAYS = 86400;

  // Form array of mock data
  let array = [];

  // Keep track of dates when setting data, start at July 1, 2018
  let startDate = 1530403200;

  for (let i = 0; i < ROWS; i += 1) {
    const nights = Math.floor(Math.random() * 3) + 1;
    const guests = Math.floor(Math.random() * 3) + 1;

    array.push({
      nights,
      guests,
      price: (100 + 7 * guests) * nights + 50,
      startDate,
      endDate: startDate + nights * SEC_IN_DAYS,
      homeId: 0,
    });

    // Skip 0 days to a week to allow space for reservations
    startDate += nights * SEC_IN_DAYS + (Math.floor(Math.random() * 7) * SEC_IN_DAYS);
  }

  // Convert the JSON to parenthesis for all elements
  array = array.map(obj => `(${obj.nights}, ${obj.guests}, ${obj.price}, ${obj.startDate}, ${obj.endDate}, ${obj.homeId})`);

  // Insert all rows by using commas
  return db.queryAsync(`INSERT INTO reservations (nights, guests, price, startDate, endDate, homeId) VALUES ${array.join()};`);
};

// Check if the database is empty before populating it with mock data.
// Remember that the results will be a 2D array, first element has actual results
module.exports = db => db.queryAsync('SELECT * FROM reservations')
  .then(results => (results[0].length === 0 ? seedData(db) : undefined))
  .catch(err => {throw err;});
