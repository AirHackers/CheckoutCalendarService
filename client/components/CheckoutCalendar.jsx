import React from 'react';

// Checkout and calendar widget, is designed so the checkout widget
// may influence the state of the calendar widget.
export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.small ? 'card container checkoutKeylinesTop' : 'card container'}>
        <span className='checkoutKeylinesTop'><strong>$118</strong> per night</span> 

        <hr />
        <label>Dates</label>
        <div className='row checkoutKeylines'>
          <div className='col-md-6'>
            <input className='form-control' type='text' placeholder='Check in'></input>
          </div>
          <div className='col-md-6'>
            <input className='form-control' type='text' placeholder='Check out'></input>
          </div>
        </div>

        <label>Guests</label>
        <div className='row'>
          <div className='col'>
            <input className='form-control' type='text' placeholder='1 Guest'></input>
          </div>
        </div>

        <div className='row'>
          <button className='checkoutBtnMargin col btn btn-danger' type='button'>Book</button>
        </div>

        <label className='checkoutCenterText'>You won’t be charged yet</label>
      </div>
    );
  }
}
