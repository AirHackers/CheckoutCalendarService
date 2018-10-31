import React from 'react';
import Popover from '@material-ui/core/Popover';
import Calendar from './Calendar';

import Guests from './Guests';
import Breakdown from './Breakdown';

const ADULTS = 0, CHILDREN = 1, INFANTS = 2, MILLI_SEC_IN_DAY = 86400000;
const server = 'http://127.0.0.1:3004';

// For material-ui, use typography v2
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

// Checkout and calendar widget, is designed so the checkout widget
// may influence the state of the calendar widget.
export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Property data needs to be acquired from the homes database
    // TODO: Use react router to get the ID
    this.state = {
      month: 9,
      year: 2018,
      nights: 1,
      price: null,
      personPerNight: null,
      cleaning: null,
      guests: [1, 0, 0],
      prevTotalGuests: 1,
      limit: 10,
      showGuests: false,
      isChoosingCheckIn: true,
      checkinDay: null,
      checkoutDay: null,
    };

    // Add ref to allow changing of guest input, and detect if clicked outside
    this.guestRef = React.createRef();
    this.calRef = React.createRef();
  }

  // Helper methods
  
  loadPrice(id, guests, nights) {
    fetch(`${server}/api/listings/${id}/compute?guests=${guests}&nights=${nights}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        price: response.totalCost,
        personPerNight: response.personPerNight,
        cleaning: response.cleaning
      });
    })
    .catch(err => {
      console.error(err);
    });
  }

  // Total guests don't count the number of infants
  getTotalGuests() {
    return this.state.guests[ADULTS] + this.state.guests[CHILDREN];
  }
  
  // Determine whether a text input should have a green border surrounding it (indicating current selection)
  getClassesForInput(forCheckIn) {
    return Boolean(this.state.anchorEl) && this.state.isChoosingCheckIn === forCheckIn ? 'form-control is-valid' : 'form-control';
  }

  // On load, show price for 1 guest for 1 day
  componentDidMount() {
    this.loadPrice(this.props.match.params.id, this.getTotalGuests(), this.state.nights);
    
    // Cache guest element, create listener to check clicks outside it
    document.addEventListener('mousedown', this.onOutsideClick.bind(this));
  }

  // Listener methods
  
  // Called when the check in/out inputs are clicked, trigger pop over!
  onInputClick(left, event) {
    this.setState({
      isChoosingCheckIn: left,
      anchorEl: event.currentTarget,
    });
    
    if (this.calRef.current) {
      this.calRef.current.setCheckinState(this.state.isChoosingCheckIn);
    }
  }

  // Called when clicked outside of the pop over.
  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }
  
  // Update the month and year and call Calendar.setReservedData
  onCalBtnClick(left) {
    let month = this.state.month;
    let year = this.state.year;

    if (left) {
      year = month > 0 ? year : year - 1;
      month = month > 0 ? month - 1 : 11;
    } else {
      year = month < 11 ? year : year + 1;
      month = month < 11 ? month + 1 : 0;
    }

    this.setState({
      month, year
    });
    
    this.calRef.current.setReservedData(this.props.match.params.id, month, year);
  }

  leftBtnFor(idx) {
    let guests = this.state.guests;
    if (guests[idx] !== 0) {
      guests[idx]--;
      this.setState({guests});
      this.guestRef.current.value = `${this.getTotalGuests()} Guests`;
    }
  }

  rightBtnFor(idx) {
    let guests = this.state.guests;
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

  // Listener for all 3 toggling methods. If closing, update the price if guest number changes.
  onToggleGuests() {
    if (this.state.showGuests && this.state.prevTotalGuests !== this.getTotalGuests()) {
      this.loadPrice(this.props.match.params.id, this.getTotalGuests(), this.state.nights);
    }

    this.setState({
      prevTotalGuests: this.getTotalGuests(),
      showGuests: !this.state.showGuests
    });
  }
  
  // Date is changed, if check in and out dates exist, also update price and close popover
  onChangeDate(isCheckIn, timeStamp) {
    let nights = null;
    if (this.state.checkinDay && !isCheckIn) {
      nights = (timeStamp - this.state.checkinDay) / MILLI_SEC_IN_DAY;
      this.loadPrice(this.props.match.params.id, this.getTotalGuests(), nights);
      this.handleClose();
    }

    this.setState({
      nights,
      isChoosingCheckIn: !isCheckIn,
      [isCheckIn ? 'checkinDay' : 'checkoutDay']: timeStamp // State key depends on whether check in day is set
    });
  }
  
  onResetDates() {
    this.setState({
      checkinDay: null,
      checkoutDay: null
    });
  }

  render() {
    var checkinStr = this.state.checkinDay ? new Date(this.state.checkinDay).toLocaleDateString() : 'Check in';
    var checkoutStr = this.state.checkoutDay ? new Date(this.state.checkoutDay).toLocaleDateString() : 'Check out';
    return (
      <div className={this.props.small ? 'card container checkoutMaxWidth' : 'card container'}>
        <span className='checkoutKeylinesTop'>
        { this.state.personPerNight ?
          <span><strong>${this.state.personPerNight}</strong> per night</span> : <span>Loading...</span>
        }
        </span>

        <hr />
        <label>Dates</label>
        <div className='row checkoutKeylines'>
          <div className='col-md-6'>
            <input className={this.getClassesForInput(true)} type='text' value={checkinStr} onClick={this.onInputClick.bind(this, true)} readOnly></input>
          </div>
          <div className='col-md-6'>
            <input className={this.getClassesForInput(false)} type='text' value={checkoutStr} onClick={this.onInputClick.bind(this, false)} readOnly></input>
          </div>
        </div>

        {/* The Popover allows customizing its position and whether it is open */}
        <Popover
          id="simple-popper"
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: this.state.isChoosingCheckIn ? 'right' : 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }} >
          <Calendar small ref={this.calRef} id={this.props.match.params.id} month={this.state.month} year={this.state.year}
            btnClick={this.onCalBtnClick.bind(this)} initCheckin={this.state.isChoosingCheckIn}
            onChangeDate={this.onChangeDate.bind(this)} checkinDay={this.state.checkinDay} checkoutDay={this.state.checkoutDay}
            resetDates={this.onResetDates.bind(this)} />
        </Popover>

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

        { this.state.checkinDay && this.state.checkoutDay &&
          <Breakdown perPerson={this.state.personPerNight} nights={this.state.nights} cleaning={this.state.cleaning} total={this.state.price} />
        }

        <div className='row'>
          <button className='checkoutBtnMargin col btn btn-danger' type='button'>Request to Book</button>
        </div>

        <label className='checkoutCenterText'>You won’t be charged yet</label>
      </div>
    );
  }
}
