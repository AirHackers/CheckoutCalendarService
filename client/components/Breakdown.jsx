import React from 'react';

// Use Bootstrap gridding to position elements in a table-like manner.
// Border classes allow the top and bottom borders in the lists to be omitted
var Breakdown = props => (
  <ul className='list-group list-group-flush'>
    <li className='list-group-item border-top-0'>
      <div className='row'>
        <span className='col-md-9'>
          ${`${props.perPerson} x ${props.nights} nights`}
        </span>
        <span className='col-md-3 checkoutRightText'>
          ${props.perPerson * props.nights}
        </span>
      </div>
    </li>

    <li className='list-group-item'>
      <div className='row'>
        <span className='col-md-9'>
          Cleaning Fee
        </span>
        <span className='col-md-3 checkoutRightText'>
          ${props.cleaning}
        </span>
      </div>
    </li>

    <li className='list-group-item border-bottom-0'>
      <div className='row'>
        <strong className='col-md-9'>
          Total
        </strong>
        <strong className='col-md-3 checkoutRightText'>
          ${props.total}
        </strong>
      </div>
    </li>
  </ul>
);

export default Breakdown;
