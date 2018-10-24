// Populate the database with mock data.
// For each row, create a random number of nights and guests,
// and use the # of nights to calculate the start and end dates

module.exports = (db) => {
  const ROWS = 100;
  consts SEC_IN_DAYS = 86400;

  // Form array of mock data
  var array = [];

  // Keep track of dates when setting data, start at July 1, 2018
  var startDate = 1530403200;

  for (var i = 0; i < ROWS; i++) {
    var nights = Math.floor(Math.random() * 5);
    var guests = Math.floor(Math.random() * 3) + 1;

    array.push({
      nights,
      guests,
      price: (100 + 7 * guests) * nights + 50,
      startDate,
      endDate: startDate + nights * SEC_IN_DAYS,
      homeId: 0
    });

    startDate += nights * SEC_IN_DAYS;
  }

  // Convert the JSON to parenthesis for all elements
  array = array.map(obj => `(${obj.nights}, ${obj.guests}, ${obj.price}, ${obj.startDate}, ${obj.endDate}, ${obj.homeId})`);
  
  // Insert all rows by using commas
  return db.queryAsync(`INSERT INTO reservations (nights, guests, price, startDate, endDate, homeId) VALUES ${array.join()};`)
  .then((results) => {
    console.log(results);
  });
};