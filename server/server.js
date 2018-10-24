const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Endpoints for the Checkout component
app.get('/api/reserved', (req, res) => {
  var month = req.query.month;
  var year = req.query.year;
  
  // Populate the response data
  var resultArray = [];
  resultArray.push([1, 5]);
  resultArray.push([7, 10]);
  
  res.status(200).type('application/json');
  res.send(JSON.stringify(resultArray));
});

// Given inputs for number of nights, guests, return JSON for the rental cost
app.get('/api/compute', (req, res) => {
  var nights = req.query.nights || 1;
  var guests = req.query.guests || 1;

  //TODO: Move calculation to a separate class
  var result = {
    totalCost: (100 + 7 * guests) * nights + 50,
    personPerNight: (100 + 7 * guests),
    cleaning: 50
  };

  res.status(200).type('application/json');
  res.send(JSON.stringify(result));
});

app.post('/api/reserve', (req, res, next) => {
  // Save body to DB
    
  res.status(201).type('application/json');
  res.send('{"success" : true}');
});

app.listen(PORT);
