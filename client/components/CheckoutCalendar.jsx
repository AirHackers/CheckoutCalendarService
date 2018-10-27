import React from 'react';

import Guests from './Guests.jsx';

// Checkout and calendar widget, is designed so the checkout widget
// may influence the state of the calendar widget.

// TODO: Use a ref for the input tags to directly control them on state change
export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Property data needs to be acquired from the homes database
    this.state = {
      days: 1,
      price: null,
      personPerNight: null,
      guests: [1, 0, 0],
      limit: 10,
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

  getTotalGuests() {
    return this.state.guests.reduce((a, b) => a + b);
  }

  // On load, show price for 1 guest for 1 day
  componentDidMount() {
    this.loadPrice(this.getTotalGuests(), this.state.days);
  }

  leftBtnFor(idx) {
    var guests = this.state.guests;
    if (guests[idx] !== 0) {
      guests[idx]--;
      this.setState({guests});
    }
  }

  rightBtnFor(idx) {
    var guests = this.state.guests;
    if (this.getTotalGuests() < this.state.limit) {
      guests[idx]++;
      this.setState({guests});
    }
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

        <Guests adults={this.state.guests[0]} children={this.state.guests[1]} infants={this.state.guests[2]}
          limit={this.state.limit} total={this.getTotalGuests()}
          leftBtn={this.leftBtnFor.bind(this)} rightBtn={this.rightBtnFor.bind(this)} />

        <div className='row'>
          <button className='checkoutBtnMargin col btn btn-danger' type='button'>Book</button>
        </div>

        <label className='checkoutCenterText'>You won’t be charged yet</label>
      </div>
    );
  }
}
