import React from 'react';
import Popover from '@material-ui/core/Popover';
import PropTypes from 'prop-types';

import Calendar from './Calendar';
import Guests from './Guests';
import Breakdown from './Breakdown';

const ADULTS = 0, CHILDREN = 1, INFANTS = 2, MAX_INFANTS = 5,
  MILLI_SEC_IN_DAY = 86400000, SCROLL_THRESHOLD = 450, MAX_RATING = 5;
const server = 'http://127.0.0.1:3004';
const reviews_server = 'http://127.0.0.1:3003';

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
      floating: false,
      rating: null,
      numReviews: null,
    };

    // Add ref to allow changing of guest input, and detect if clicked outside
    this.guestRef = React.createRef();
    this.calRef = React.createRef();
  }

  // On load, show price for 1 guest for 1 day
  componentDidMount() {
    this.loadPrice(this.props.match.params.id, this.getTotalGuests(), this.state.nights);
    this.loadRating(this.props.match.params.id);

    // Cache guest element, create listener to check clicks outside it
    document.addEventListener('mousedown', this.onOutsideClick.bind(this));
    
    // Allow Checkout to be fixed on the screen 
    window.addEventListener('scroll', this.onHandleScroll.bind(this));
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
    if ((idx === INFANTS && guests[idx] < MAX_INFANTS) || this.getTotalGuests() < this.state.limit) {
      guests[idx] += 1;
      this.setState({ guests });
      const infants = guests[INFANTS] > 0 ? `, ${this.state.guests[INFANTS]} infant` : '';
      this.guestRef.current.value = `${this.getTotalGuests()} guests${infants}`;
    }
  }

  onHandleScroll(event) {
    let scrollTop = window.scrollY;

    this.setState({
      floating: scrollTop >= SCROLL_THRESHOLD
    });
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
  
  getStar(filled) {
    const style = {
      height: '1em',
      width: '1em',
      fill: filled ? '#008489' : 'rgb(231, 231, 231)'
    };
    
    return (
      <svg viewBox="0 0 1000 1000" role="presentation" style={style}>
        <path d="M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z"></path>
      </svg>
    );
  }

  // Total guests don't count the number of infants
  getTotalGuests() {
    return this.state.guests[ADULTS] + this.state.guests[CHILDREN];
  }

  // Determine whether a text input should have a green border
  // surrounding it (indicating current selection)
  getClassesForInput(forCheckIn) {
    let str = 'form-control checkoutFont';
    if (Boolean(this.state.anchorEl) && this.state.isChoosingCheckIn === forCheckIn) {
      str += ' is-valid'; // Add Bootstrap class for green border
    }
    return str;
  }

  // Called when clicked outside of the pop over.
  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }

  loadPrice(id, guests, nights) {
    return fetch(`${server}/api/listings/${id}/compute?guests=${guests}&nights=${nights}`)
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

  loadRating(id) {
    return fetch(`${reviews_server}/api/homes/${id}/allReviews`)
      .then(response => response.json())
      .then((response) => {
        this.setState({
          rating: response[0].rateNumber,
          numReviews: response[0].numberOfReviews,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  render() {
    const {
      month, year, nights, price, personPerNight, cleaning, service, guests,
      limit, showGuests, isChoosingCheckIn, checkinDay, checkoutDay, anchorEl, rating, numReviews
    } = this.state;
    const checkinStr = checkinDay ? new Date(checkinDay).toLocaleDateString() : 'Check in';
    const checkoutStr = checkoutDay ? new Date(checkoutDay).toLocaleDateString() : 'Check out';
    const classes = `checkoutCard checkoutContainer ${ this.state.floating ? 'checkoutFloat' : 'checkoutNoFloat' }`;
    
    // Populate star data
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(true);
    }
    for (let i = 0; i < MAX_RATING - rating; i++) {
      stars.push(false);
    }

    return (
      <div id={this.props.small ? 'checkoutMaxWidth' : null} className={classes}>
        <span className="checkoutKeylinesTop">
          { personPerNight
            ? (
              <span className="checkoutFont checkoutSmall">
                <span className="checkoutBook">
                  $
                  {personPerNight}
                </span>
                {' '}
                  per night
              </span>
            ) : <span>Loading...</span>
        }
        </span>
        
        { rating &&
          <div id="checkoutStarGrid">
            <span>{ stars.map(filled => this.getStar(filled)) }</span>
            <span className="checkoutFont checkoutSmall checkoutReviewNum">{numReviews}</span>
          </div>
        }

        <hr />
        <label htmlFor="checkinInput" className="checkoutFont checkoutSmall">Dates</label>
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

        <label htmlFor="guestText" className="checkoutFont checkoutSmall">Guests</label>
        <div className="checkoutRow">
          <div className="checkout-12">
            <input
              id="guestText"
              ref={this.guestRef}
              className="form-control checkoutFont"
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
          <button className="checkoutBtnMargin checkout-12 checkoutFont checkoutBook btn btn-danger" type="button">Request to Book</button>
        </div>

        <span className="checkoutCenterText checkoutKeylines checkoutFont checkoutSmall">You won’t be charged yet</span>
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
