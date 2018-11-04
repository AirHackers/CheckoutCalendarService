import React from 'react';
import Popover from '@material-ui/core/Popover';
import PropTypes from 'prop-types';

import Calendar from './Calendar';
import Guests from './Guests';
import Breakdown from './Breakdown';

const ADULTS = 0; const CHILDREN = 1; const INFANTS = 2; const
  MILLI_SEC_IN_DAY = 86400000;
const server = 'http://127.0.0.1:3004';

// For material-ui, use typography v2
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

// Checkout and calendar widget, is designed so the checkout widget
// may influence the state of the calendar widget.
export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Property data needs to be acquired from the homes database
    this.state = {
      month: 9,
      year: 2018,
      nights: 1,
      price: null,
      personPerNight: null,
      cleaning: null,
      service: null,
      guests: [1, 0, 0],
      limit: 10,
      showGuests: false,
      isChoosingCheckIn: true,
      checkinDay: null,
      checkoutDay: null,
      anchorEl: null,
      prevTotalGuests: 1,
    };

    // Add ref to allow changing of guest input, and detect if clicked outside
    this.guestRef = React.createRef();
    this.calRef = React.createRef();
  }

  // On load, show price for 1 guest for 1 day
  componentDidMount() {
    this.loadPrice(this.props.match.params.id, this.getTotalGuests(), this.state.nights);

    // Cache guest element, create listener to check clicks outside it
    document.addEventListener('mousedown', this.onOutsideClick.bind(this));
  }

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

    this.setState(() => ({ month, year }));

    if (this.calRef.current) {
      this.calRef.current.setReservedData(this.props.match.params.id, month, year);
    }
  }

  onLeftBtnFor(idx) {
    const guests = this.state.guests;
    if (guests[idx] !== 0) {
      guests[idx] -= 1;
      this.setState({ guests });
      const infants = guests[INFANTS] > 0 ? `, ${this.state.guests[INFANTS]} infant` : '';

      this.guestRef.current.value = `${this.getTotalGuests()} guests${infants}`;
    }
  }

  onRightBtnFor(idx) {
    const guests = this.state.guests;
    if (idx === INFANTS || this.getTotalGuests() < this.state.limit) {
      guests[idx] += 1;
      this.setState({ guests });
      const infants = guests[INFANTS] > 0 ? `, ${this.state.guests[INFANTS]} infant` : '';
      this.guestRef.current.value = `${this.getTotalGuests()} guests${infants}`;
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

    this.setState(prevState => ({
      prevTotalGuests: this.getTotalGuests(),
      showGuests: !prevState.showGuests,
    }));
  }

  // Date is changed, if check in and out dates exist, also update price and close popover
  onChangeDate(isCheckIn, timeStamp) {
    let nights = null;
    if (this.state.checkinDay && !isCheckIn) {
      nights = (timeStamp - this.state.checkinDay) / MILLI_SEC_IN_DAY;
    } else if (this.state.checkoutDay && isCheckIn) {
      nights = (this.state.checkoutDay - timeStamp) / MILLI_SEC_IN_DAY;
    }

    if (nights) {
      this.loadPrice(this.props.match.params.id, this.getTotalGuests(), nights);
      this.handleClose();
    }

    this.setState({
      nights,
      isChoosingCheckIn: !isCheckIn,
      [isCheckIn ? 'checkinDay' : 'checkoutDay']: timeStamp, // State key depends on whether check in day is set
    });
  }

  onResetDates() {
    this.setState({
      checkinDay: null,
      checkoutDay: null,
    });
  }

  // Total guests don't count the number of infants
  getTotalGuests() {
    return this.state.guests[ADULTS] + this.state.guests[CHILDREN];
  }

  // Determine whether a text input should have a green border
  // surrounding it (indicating current selection)
  getClassesForInput(forCheckIn) {
    return Boolean(this.state.anchorEl) && this.state.isChoosingCheckIn === forCheckIn ? 'form-control is-valid' : 'form-control';
  }

  // Called when clicked outside of the pop over.
  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }

  loadPrice(id, guests, nights) {
    fetch(`${server}/api/listings/${id}/compute?guests=${guests}&nights=${nights}`)
      .then(response => response.json())
      .then((response) => {
        this.setState({
          price: response.totalCost,
          personPerNight: response.personPerNight,
          cleaning: response.cleaning,
          service: response.service,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  render() {
    const {
      month, year, nights, price, personPerNight, cleaning, service, guests,
      limit, showGuests, isChoosingCheckIn, checkinDay, checkoutDay, anchorEl,
    } = this.state;
    const checkinStr = checkinDay ? new Date(checkinDay).toLocaleDateString() : 'Check in';
    const checkoutStr = checkoutDay ? new Date(checkoutDay).toLocaleDateString() : 'Check out';

    return (
      <div id={this.props.small ? 'checkoutMaxWidth' : null} className="checkoutCard checkoutContainer">
        <span className="checkoutKeylinesTop">
          { personPerNight
            ? (
              <span>
                <strong>
                  $
                  {personPerNight}
                </strong>
                {' '}
                  per night
              </span>
            ) : <span>Loading...</span>
        }
        </span>

        <hr />
        <label htmlFor="checkinInput">Dates</label>
        <div className="checkoutRow checkoutKeylines">
          <div className="checkout-6">
            <input
              id="checkinInput"
              className={this.getClassesForInput(true)}
              type="text"
              value={checkinStr}
              onClick={this.onInputClick.bind(this, true)}
              readOnly
            />
          </div>
          <div className="checkout-6">
            <input
              className={this.getClassesForInput(false)}
              type="text"
              value={checkoutStr}
              onClick={this.onInputClick.bind(this, false)}
              readOnly
            />
          </div>
        </div>

        {/* The Popover allows customizing its position and whether it is open */}
        <Popover
          id="simple-popper"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: isChoosingCheckIn ? 'right' : 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Calendar
            small
            ref={this.calRef}
            id={this.props.match.params.id}
            month={month}
            year={year}
            btnClick={this.onCalBtnClick.bind(this)}
            initCheckin={isChoosingCheckIn}
            onChangeDate={this.onChangeDate.bind(this)}
            checkinDay={checkinDay}
            checkoutDay={checkoutDay}
            resetDates={this.onResetDates.bind(this)}
          />
        </Popover>

        <label htmlFor="guestText">Guests</label>
        <div className="checkoutRow">
          <div className="checkout-12">
            <input
              id="guestText"
              ref={this.guestRef}
              className="form-control"
              type="text"
              defaultValue="1 guest"
              onClick={this.onToggleGuests.bind(this)}
              readOnly
            />
          </div>
        </div>

        { showGuests
          && (
          <Guests
            adults={guests[ADULTS]}
            childrenNum={guests[CHILDREN]}
            infants={guests[INFANTS]}
            limit={limit}
            total={this.getTotalGuests()}
            leftBtn={this.onLeftBtnFor.bind(this)}
            rightBtn={this.onRightBtnFor.bind(this)}
            close={this.onToggleGuests.bind(this)}
          />
          )
        }

        { checkinDay && checkoutDay
          && (
          <Breakdown
            perPerson={personPerNight}
            nights={nights}
            cleaning={cleaning}
            service={service}
            total={price}
          />
          )
        }

        <div className="checkoutRow">
          <button className="checkoutBtnMargin checkout-12 btn btn-danger" type="button">Request to Book</button>
        </div>

        <span className="checkoutCenterText checkoutKeylines">You won’t be charged yet</span>
      </div>
    );
  }
}

CheckoutCalendar.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
  small: PropTypes.bool,
};

CheckoutCalendar.defaultProps = {
  small: false,
};
