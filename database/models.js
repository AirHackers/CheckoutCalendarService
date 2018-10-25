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
  static getReservedDates(db, month, year) {
    const startVal = new Date(year, month).getTime() / MILLI_IN_SECS;
    const endVal = new Date(year, month + 1).getTime() / MILLI_IN_SECS;

    return db.queryAsync(`SELECT * FROM reservations WHERE startDate >= ${startVal} AND endDate <= ${endVal};`)
    .then(data => {
      return data[0].map(obj => this.getDays(obj.startDate, obj.endDate));
    });
  }

  // Returns an object that represents information for the checkout module
  static calcPrice(nights, guests) {
    return {
      totalCost: (100 + 7 * guests) * nights + 50,
      personPerNight: (100 + 7 * guests),
      cleaning: 50
    };
  }

  // Adds a reservation object into the database. Returns a promise that indicates the result of the insert.
  static addReservation(db, data) {
    const valueStr = Object.values(data).join(' ');
    return db.queryAsync(`INSERT INTO reservations (nights, guests, price, startDate, endDate, homeId) VALUES (${valueStr});`);
  }  
}

module.exports = Models;
