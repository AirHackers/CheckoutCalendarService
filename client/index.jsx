import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import CheckoutCalendar from './components/CheckoutCalendar';

ReactDOM.render((
  <BrowserRouter>
    <Route path='/listings/:id' render={(props) => <CheckoutCalendar {...props} small />} />
  </BrowserRouter>
), document.getElementById('app'));
