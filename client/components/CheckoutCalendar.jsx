import React from 'react';

import Guests from './Guests.jsx';

// Checkout and calendar widget, is designed so the checkout widget
// may influence the state of the calendar widget.

// TODO: Use a ref for the input tags to directly control them on state change
export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      days: 1,
      price: null,
      personPerNight: null
    };
  }

  loadPrice(guests, days) {
    fetch(`/api/compute?guests=${guests}&days=${days}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        price: response.totalCost,
        personPerNight: response.personPerNight
      });
    });
  }

  // On load, show price for 1 guest for 1 day
  componentDidMount() {
    this.loadPrice(this.state.guests, this.state.days);
  }

  render() {
    return (
      <div className={this.props.small ? 'card container checkoutKeylinesTop' : 'card container'}>
        <span className='checkoutKeylinesTop'>
        { this.state.price ?
          <span><strong>${this.state.price}</strong> per night</span> : <span>Loading...</span>
        }
        </span>

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
        
        <Guests />

        <div className='row'>
          <button className='checkoutBtnMargin col btn btn-danger' type='button'>Book</button>
        </div>

        <label className='checkoutCenterText'>You won’t be charged yet</label>
      </div>
    );
  }
}
