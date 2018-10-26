import React from 'react';

// Subcomponent for the buttons and the quantity for a given row
var GuestChooser = props => (
  <div className='row checkoutKeylines'>
    <div className='col'>
      <button className={ props.quantity === 0 ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary'}>-</button>
    </div>
    <div className='col'>
      <span>{props.quantity}</span>
    </div>
    <div className='col'>
      <button className={ props.quantity === props.limit ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary'}>+</button>
    </div>
  </div>
);

// Subcomponent for the guest type and quantity
var GuestRow = props => (
  <div className={props.top ? 'row checkoutKeylinesTop' : 'row'}>
    <div className='col'>{props.input}</div>
    <div className='col'>
      <GuestChooser quantity={0} limit={4} />
    </div>
  </div>
);

// Component for encapsulating specific guest types and quantities
export default class Guests extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='card container'>
        <GuestRow top={true} input='Adults' />
        <GuestRow input='Children' />
        <GuestRow input='Infants' />
        <div className='row checkoutKeylines'>
          {/* Invisible divs to position the button */}
          <div className='col-md-6'></div>
          <div className='col-md-4'>
            <button className='btn btn-outline-primary checkoutFloatRight'>Close</button>
          </div>
          <div className='col-md-2'></div>
        </div>
      </div>
    );
  }
}
