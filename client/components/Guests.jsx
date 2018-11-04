import React from 'react';
import PropTypes from 'prop-types';

// Subcomponent for the buttons and the quantity for a given row
const GuestChooser = ({
  quantity, limit, idx, total, infant, leftBtn, rightBtn,
}) => {
  const firstClass = quantity === 0 && !infant ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary';
  const secondClass = (quantity === limit || total >= limit) && !infant ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary';

  return (
    <div className="checkoutRow checkoutKeylines">
      <div className="checkout-3">
        <button type="button" className={firstClass} onClick={leftBtn.bind(this, idx)}>-</button>
      </div>
      <div className="checkout-3 checkoutCenterText">
        <span>{quantity}</span>
      </div>
      <div className="checkout-3">
        <button type="button" className={secondClass} onClick={rightBtn.bind(this, idx)}>+</button>
      </div>
    </div>
  );
};

GuestChooser.propTypes = {
  quantity: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  infant: PropTypes.bool,
  leftBtn: PropTypes.func.isRequired,
  rightBtn: PropTypes.func.isRequired,
};

GuestChooser.defaultProps = {
  infant: false,
};

// Subcomponent for the guest type and quantity
const GuestRow = ({
  top, input, quantity, total, limit, idx, infant, leftBtn, rightBtn,
}) => (
  <div className={top ? 'checkoutRow checkoutKeylinesTop' : 'checkoutRow'}>
    <div className="checkout-6">
      {input}
    </div>
    <div className="checkout-6">
      <GuestChooser
        quantity={quantity}
        limit={limit}
        idx={idx}
        total={total}
        infant={infant}
        leftBtn={leftBtn}
        rightBtn={rightBtn}
      />
    </div>
  </div>
);

GuestRow.propTypes = {
  top: PropTypes.bool,
  input: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  infant: PropTypes.bool,
  leftBtn: PropTypes.func.isRequired,
  rightBtn: PropTypes.func.isRequired,
};

GuestRow.defaultProps = {
  top: false,
  infant: false,
};

// Component for encapsulating specific guest types and quantities
const Guests = ({
  adults, childrenNum, infants, limit, total, leftBtn, rightBtn, close,
}) => (
  <div id="guests" className="checkoutCard checkoutContainer">
    <GuestRow
      top
      input="Adults"
      quantity={adults}
      total={total}
      limit={limit}
      idx={0}
      leftBtn={leftBtn}
      rightBtn={rightBtn}
    />
    <GuestRow
      input="Children"
      quantity={childrenNum}
      total={total}
      limit={limit}
      idx={1}
      leftBtn={leftBtn}
      rightBtn={rightBtn}
    />
    <GuestRow
      input="Infants"
      quantity={infants}
      total={total}
      limit={limit}
      idx={2}
      infant
      leftBtn={leftBtn}
      rightBtn={rightBtn}
    />
    <span className="checkoutKeylines">
      {limit}
      {' '}
      guests maximum. Infants don’t count toward the number of guests.
    </span>
    <div className="checkoutRow checkoutKeylines">
      <div className="checkout-12">
        <button
          type="button"
          className="btn btn-outline-primary checkoutFloatRight"
          onClick={close}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

Guests.propTypes = {
  adults: PropTypes.number.isRequired,
  childrenNum: PropTypes.number.isRequired,
  infants: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  leftBtn: PropTypes.func.isRequired,
  rightBtn: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default Guests;
