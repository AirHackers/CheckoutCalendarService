import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import CheckoutCalendar from './components/CheckoutCalendar';

import './scss/app.scss';
import './app.css';

ReactDOM.render((
  <BrowserRouter>
    <Route path="/listings/:id" render={props => <CheckoutCalendar {...props} small />} />
  </BrowserRouter>
), document.getElementById('checkout'));
