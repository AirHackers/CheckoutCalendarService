// Static methods for database interactions for the 3 endpoints

const MILLI_IN_SECS = 1000;

class Models {
  // Get the day in the month for the given timestamps
  static getDays(start, end) {
    const startDate = new Date(start * MILLI_IN_SECS);
    const endDate = new Date(end * MILLI_IN_SECS);
    return [startDate.getDate(), endDate.getDate()];
  }

  // Returns a promise with the reserved dates, due to needing a DB selection query.
  static getReservedDates(db, id, month, year) {
    const startVal = new Date(year, month).getTime() / MILLI_IN_SECS;
    const endVal = new Date(year, month + 1).getTime() / MILLI_IN_SECS;

    return db.queryAsync(`SELECT * FROM reservations WHERE homeId = ${id} AND startDate >= ${startVal} AND endDate <= ${endVal};`)
      .then(data => data[0].map(obj => this.getDays(obj.startDate, obj.endDate)));
  }

  // Returns an object that represents information for the checkout module
  // TODO: Formula needs to depend on data from a listing based on the foreign key ID
  static calcPrice(id, nights, guests) {
    const [personPerNight, cleaning] = [(100 + 7 * guests), 50];
    const service = Math.floor((Math.random() * 0.08 + 0.07) * (personPerNight * nights + cleaning));
    const totalCost = personPerNight * nights + cleaning + service;
    return {
      totalCost,
      personPerNight,
      cleaning,
      service,
    };
  }

  // Adds a reservation object into the database.
  // Returns a promise that indicates the result of the insert.
  static addReservation(db, data) {
    // Validate the date ranges, ensure there are no other reservations
    // that conflict with the input date range
    return db.queryAsync(`SELECT * FROM reservations WHERE startDate >= ${data.startDate} AND endDate <= ${data.endDate};`)
      .then((result) => {
        if (result[0].length > 0) {
          return { success: false };
        }

        return db.queryAsync('INSERT INTO reservations (nights, guests, price, startDate, endDate, homeId) VALUES (?, ?, ?, ?, ?, ?);', Object.values(data))
          .then(() => ({ success: true }));
      });
  }
}

module.exports = Models;
