import React from 'react';

// Subcomponent for the buttons and the quantity for a given row
var GuestChooser = props => {
  const firstClass = props.quantity === 0 && !props.infant ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary';
  const secondClass = props.quantity === props.limit || props.total >= props.limit && !props.infant ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary';
  
  return (
    <div className='row checkoutKeylines'>
      <div className='col'>
        <button className={firstClass} onClick={props.leftBtn.bind(this, props.idx)}>-</button>
      </div>
      <div className='col'>
        <span>{props.quantity}</span>
      </div>
      <div className='col'>
        <button className={secondClass} onClick={props.rightBtn.bind(this, props.idx)}>+</button>
      </div>
    </div>
  );
};

// Subcomponent for the guest type and quantity
var GuestRow = props => (
  <div className={props.top ? 'row checkoutKeylinesTop' : 'row'}>
    <div className='col'>
      {props.input}
    </div>
    <div className='col'>
      <GuestChooser quantity={props.quantity} limit={props.limit} idx={props.idx} total={props.total} infant={props.infant}
        leftBtn={props.leftBtn} rightBtn={props.rightBtn} />
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
      <div id='guests' className='card container'>
        <GuestRow top={true} input='Adults' quantity={this.props.adults} total={this.props.total} limit={this.props.limit} idx={0} 
          leftBtn={this.props.leftBtn} rightBtn={this.props.rightBtn} />
        <GuestRow input='Children' quantity={this.props.children} total={this.props.total} limit={this.props.limit} idx={1} 
          leftBtn={this.props.leftBtn} rightBtn={this.props.rightBtn} />
        <GuestRow input='Infants' quantity={this.props.infants} total={this.props.total} limit={this.props.limit} idx={2} infant={true}
          leftBtn={this.props.leftBtn} rightBtn={this.props.rightBtn} />
        <label className='checkoutCenterText'>{this.props.limit} guests maximum. Infants don’t count toward the number of guests.</label>
        <div className='row checkoutKeylines'>
          {/* Invisible divs to position the button */}
          <div className='col-md-6'></div>
          <div className='col-md-4'>
            <button className='btn btn-outline-primary checkoutFloatRight' onClick={this.props.close}>Close</button>
          </div>
          <div className='col-md-2'></div>
        </div>
      </div>
    );
  }
}
