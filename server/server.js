const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Models = require('../database/models.js');
const db = require('../database');

const app = express();
const PORT = 3004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../public')));

// Endpoints for the Checkout component

// Get all the reverse dates for a given month
app.get('/api/reserved', (req, res) => {
  var month = Number.parseInt(req.query.month);
  var year = Number.parseInt(req.query.year);
  
  Models.getReservedDates(db, month, year)
  .then(result => {
    res.status(200).type('application/json');
    res.send(JSON.stringify(result));
  });
});

// Given inputs for number of nights, guests, return JSON for the rental cost
app.get('/api/compute', (req, res) => {
  var nights = Number.parseInt(req.query.nights) || 1;
  var guests = Number.parseInt(req.query.guests) || 1;

  res.status(200).type('application/json');
  res.send(JSON.stringify(Models.calcPrice(nights, guests)));
});

// Save body to DB
app.post('/api/reserve', (req, res, next) => {
  Models.addReservation(db, req.body)
  .then(result => {
    res.status(201).type('application/json');
    res.send('{"success" : true}');
  });
});

app.listen(PORT, () => console.log(`Checkout service module listening to port ${PORT}`));
