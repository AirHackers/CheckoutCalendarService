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
export default class Guests extends React.Component {
  render() {
    return (
      <div id="guests" className="checkoutCard checkoutContainer">
        <GuestRow
          top
          input="Adults"
          quantity={this.props.adults}
          total={this.props.total}
          limit={this.props.limit}
          idx={0}
          leftBtn={this.props.leftBtn}
          rightBtn={this.props.rightBtn}
        />
        <GuestRow
          input="Children"
          quantity={this.props.childrenNum}
          total={this.props.total}
          limit={this.props.limit}
          idx={1}
          leftBtn={this.props.leftBtn}
          rightBtn={this.props.rightBtn}
        />
        <GuestRow
          input="Infants"
          quantity={this.props.infants}
          total={this.props.total}
          limit={this.props.limit}
          idx={2}
          infant
          leftBtn={this.props.leftBtn}
          rightBtn={this.props.rightBtn}
        />
        <span className="checkoutKeylines">
          {this.props.limit}
          {' '}
          guests maximum. Infants don’t count toward the number of guests.
        </span>
        <div className="checkoutRow checkoutKeylines">
          <div className="checkout-12">
            <button type="button" className="btn btn-outline-primary checkoutFloatRight" onClick={this.props.close}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}
