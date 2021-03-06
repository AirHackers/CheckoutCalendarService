import React from 'react';
import PropTypes from 'prop-types';

// Use Bootstrap gridding to position elements in a table-like manner.
// Border classes allow the top and bottom borders in the lists to be omitted
const Breakdown = ({
  perPerson, nights, cleaning, service, total,
}) => (
  <ul className="list-group list-group-flush">
    <li className="list-group-item border-top-0">
      <div className="checkoutRow">
        <span className="checkout-9 checkoutFont">
          $
          {`${perPerson} x ${nights} nights`}
        </span>
        <span className="checkout-3 checkoutFont checkoutRightText">
          $
          {perPerson * nights}
        </span>
      </div>
    </li>

    <li className="list-group-item">
      <div className="checkoutRow">
        <span className="checkout-9 checkoutFont">
          Cleaning Fee
        </span>
        <span className="checkout-3 checkoutFont checkoutRightText">
          $
          {cleaning}
        </span>
      </div>
    </li>

    <li className="list-group-item">
      <div className="checkoutRow">
        <span className="checkout-9 checkoutFont">
          Service Fee
        </span>
        <span className="checkout-3 checkoutFont checkoutRightText">
          $
          {service}
        </span>
      </div>
    </li>

    <li className="list-group-item border-bottom-0">
      <div className="checkoutRow">
        <strong className="checkout-9 checkoutFont checkoutBold">
          Total
        </strong>
        <strong className="checkout-3 checkoutFont checkoutBold checkoutRightText">
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
  service: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default Breakdown;
