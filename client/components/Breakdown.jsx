import React from 'react';
import PropTypes from 'prop-types';

// Use Bootstrap gridding to position elements in a table-like manner.
// Border classes allow the top and bottom borders in the lists to be omitted
const Breakdown = ({
  perPerson, nights, cleaning, total,
}) => (
  <ul className="list-group list-group-flush">
    <li className="list-group-item border-top-0">
      <div className="row">
        <span className="col-md-9">
          $
          {`${perPerson} x ${nights} nights`}
        </span>
        <span className="col-md-3 checkoutRightText">
          $
          {perPerson * nights}
        </span>
      </div>
    </li>

    <li className="list-group-item">
      <div className="row">
        <span className="col-md-9">
          Cleaning Fee
        </span>
        <span className="col-md-3 checkoutRightText">
          $
          {cleaning}
        </span>
      </div>
    </li>

    <li className="list-group-item border-bottom-0">
      <div className="row">
        <strong className="col-md-9">
          Total
        </strong>
        <strong className="col-md-3 checkoutRightText">
          $
          {total}
        </strong>
      </div>
    </li>
  </ul>
);

Breakdown.propTypes = {
  perPerson: PropTypes.number.isRequired,
  nights: PropTypes.number.isRequired,
  cleaning: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default Breakdown;
