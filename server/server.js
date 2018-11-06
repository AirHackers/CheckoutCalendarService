const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Models = require('../database/models.js');
const db = require('../database');

const app = express();
const PORT = 3004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

// Allow CORS for a given endpoint
const allowCORS = function(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

// Endpoints for the Checkout component

// Get all the reverse dates for a given month
app.get('/api/listings/:id/reserved', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const month = Number.parseInt(req.query.month, 10);
  const year = Number.parseInt(req.query.year, 10);

  if (Number.isNaN(id) || Number.isNaN(month) || Number.isNaN(year)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: !id ? 'ID is missing or is not a number' : 'Month and/or year is missing in query.' }));
  } else {
    Models.getReservedDates(db, id, month, year)
      .then((result) => {
        allowCORS(res);
        res.status(200).type('application/json');
        res.send(JSON.stringify(result));
      });
  }
});

// Given inputs for number of nights, guests, return JSON for the rental cost
app.get('/api/listings/:id/compute', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const nights = Number.parseInt(req.query.nights, 10) || 1;
  const guests = Number.parseInt(req.query.guests, 10) || 1;

  if (Number.isNaN(id)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'ID is missing or is not a number' }));
  } else {
    allowCORS(res);
    res.status(200).type('application/json');
    res.send(JSON.stringify(Models.calcPrice(id, nights, guests)));
  }
});

// Handles HTML requests for a given ID, will be routed by React Router
app.get('/homes/:homeID', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Save body to DB
app.post('/api/reserve', (req, res) => {
  Models.addReservation(db, req.body)
    .then((result) => {
      allowCORS(res);
      res.status(201).type('application/json');
      res.send(JSON.stringify(result));
    });
});

app.listen(PORT, () => console.log(`Checkout service module listening to port ${PORT}`));
