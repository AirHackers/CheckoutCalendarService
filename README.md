# CheckoutCalendarService
This is the implementation for the Checkout and Calendar service for Wander-Lodge.

## Setup Instructions

To run a test environment of this service, first install packages with `npm install`, then open two terminal windows to run `npm start` and `node server/server.js` to build a bundle and to launch the server backend. Now you may go to localhost:3004 to check out the service, and the endpoints are available as well.

## Endpoint details
 * /api/listings/:id/reserved/ - Returns all reserved data ranges for which the selected rental is reserved, based on the variable ID path.
   * Query format: month, year
 * /api/:id/compute/ - Calculate price breakdown for the selected rental, based on the variable ID path.
   * Query format: number of nights, guests

## Libraries and Frameworks
 * Webpack 4
 * Babel
 * express.js
 * React 16
 * Bootstrap 4
 * MySQL database and npm driver
 * Testing frameworks:
   * Jest
   * Enzyme
