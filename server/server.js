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
app.get('/api/listings/:id/reserved', (req, res) => {
  var id = Number.parseInt(req.params.id);
  var month = Number.parseInt(req.query.month);
  var year = Number.parseInt(req.query.year);
  
  if (isNaN(id) || isNaN(month) || isNaN(year)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({'success' : false, 'error' : !id ? 'ID is missing or is not a number' : 'Month and/or year is missing in query.'}));
  } else {
    Models.getReservedDates(db, id, month, year)
    .then(result => {
      res.status(200).type('application/json');
      res.send(JSON.stringify(result));
    });
  }
});

// Given inputs for number of nights, guests, return JSON for the rental cost
app.get('/api/listings/:id/compute', (req, res) => {
  var id = Number.parseInt(req.params.id);
  var nights = Number.parseInt(req.query.nights) || 1;
  var guests = Number.parseInt(req.query.guests) || 1;

  if (isNaN(id)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({'success' : false, 'error' : 'ID is missing or is not a number'}));
  } else {
    res.status(200).type('application/json');
    res.send(JSON.stringify(Models.calcPrice(id, nights, guests)));
  }
});

// Handles HTML requests for a given ID, will be routed by React Router
app.get('/listings/:id', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

// Save body to DB
app.post('/api/reserve', (req, res, next) => {
  Models.addReservation(db, req.body)
  .then(result => {
    res.status(201).type('application/json');
    res.send(JSON.stringify(result));
  });
});

app.listen(PORT, () => console.log(`Checkout service module listening to port ${PORT}`));
