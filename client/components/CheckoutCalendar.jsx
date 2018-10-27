import React from 'react';

import Guests from './Guests.jsx';

const ADULTS = 0, CHILDREN = 1, INFANTS = 2;

// Checkout and calendar widget, is designed so the checkout widget
// may influence the state of the calendar widget.
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
      showGuests: false
    };

    // Add ref to allow changing of guest input, and detect if clicked outside
    this.guestRef = React.createRef();
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

  // Total guests don't count the number of infants
  getTotalGuests() {
    return this.state.guests[ADULTS] + this.state.guests[CHILDREN];
  }

  // On load, show price for 1 guest for 1 day
  componentDidMount() {
    this.loadPrice(this.getTotalGuests(), this.state.days);
    
    // Cache guest element, create listener to check clicks outside it
    document.addEventListener('mousedown', this.onOutsideClick.bind(this));
  }

  leftBtnFor(idx) {
    var guests = this.state.guests;
    if (guests[idx] !== 0) {
      guests[idx]--;
      this.setState({guests});
      this.guestRef.current.value = `${this.getTotalGuests()} Guests`;
    }
  }

  rightBtnFor(idx) {
    var guests = this.state.guests;
    if (idx === INFANTS || this.getTotalGuests() < this.state.limit) {
      guests[idx]++;
      this.setState({guests});
      this.guestRef.current.value = `${this.getTotalGuests()} Guests`;
    }
  }
  
  // Hide guest component if clicked outside of it and click not on guest text
  onOutsideClick(event) {
    const guestDiv = document.getElementById('guests');
    const clickedOutsideGuest = guestDiv && event.target.id !== 'guestText' && !guestDiv.contains(event.target);

    if (clickedOutsideGuest && this.state.showGuests) {
      this.onToggleGuests();
    }
  }
  
  onToggleGuests() {
    this.setState({
      showGuests: !this.state.showGuests
    });
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
            <input id='guestText' ref={this.guestRef} className='form-control' type='text' defaultValue='1 Guest' onClick={this.onToggleGuests.bind(this)} readOnly></input>
          </div>
        </div>

        { this.state.showGuests &&
          <Guests adults={this.state.guests[ADULTS]} children={this.state.guests[CHILDREN]} infants={this.state.guests[INFANTS]}
            limit={this.state.limit} total={this.getTotalGuests()}
            leftBtn={this.leftBtnFor.bind(this)} rightBtn={this.rightBtnFor.bind(this)} close={this.onToggleGuests.bind(this)}/>
        }

        <div className='row'>
          <button className='checkoutBtnMargin col btn btn-danger' type='button'>Book</button>
        </div>

        <label className='checkoutCenterText'>You won’t be charged yet</label>
      </div>
    );
  }
}
