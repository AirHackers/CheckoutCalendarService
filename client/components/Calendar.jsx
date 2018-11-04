import React from 'react';
import PropTypes from 'prop-types';

const WEEK_ROWS = 5; const SIX_WEEK_ROWS = 6; const DAY_COLS = 7; const
  CELL_THRESHOLD = 35;
const server = 'http://127.0.0.1:3004';

const CalendarHeader = ({
  btnClick, monthName, month, year,
}) => (
  <div className="checkoutRow checkoutKeylinesTop">
    <div className="checkout-3">
      <button type="button" className="btn btn-sm btn-outline-primary" onClick={btnClick.bind(this, true)}>←</button>
    </div>
    <div className="checkout-6 checkoutCenterText">
      <strong>{`${monthName[month]} ${year}`}</strong>
    </div>
    <div className="checkout-3">
      <button type="button" className="btn btn-sm btn-outline-primary checkoutFloatRight" onClick={btnClick.bind(this, false)}>→</button>
    </div>
  </div>
);

CalendarHeader.propTypes = {
  btnClick: PropTypes.func.isRequired,
  monthName: PropTypes.arrayOf(PropTypes.string).isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

const CalendarFooter = ({
  lastUpdated, onClear,
}) => (
  <div className="checkoutRow checkoutKeylines">
    <div className="checkout-9">{lastUpdated}</div>
    <div className="checkout-3">
      <button type="button" className="btn btn-outline-primary checkoutFloatRight" onClick={onClear}>Clear</button>
    </div>
  </div>
);

CalendarFooter.propTypes = {
  lastUpdated: PropTypes.string.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default class Calendar extends React.Component {
  // Access reserved API and return a set with all reserved data in the month in a Promise.
  static loadReserved(id, month, year) {
    return fetch(`${server}/api/listings/${id}/reserved?month=${month}&year=${year}`)
      .then(response => response.json())
      .then((reservations) => {
      // Fill reserved set with all dates for each range
        const reservedSet = new Set();
        reservations.forEach((pair) => {
          for (let i = pair[0]; i <= pair[1]; i += 1) {
            reservedSet.add(i);
          }
        });

        return reservedSet;
      })
      .catch((err) => {
        throw err;
      });
  }

  static firstDayOfWeekFor(month, year) {
    return new Date(year, month).getDay();
  }

  constructor(props) {
    super(props);

    // Month and days are 0-indexed!
    this.state = {
      isChoosingCheckIn: props.initCheckin,
      currHovered: null,
      reservedSet: new Set(),
    };

    // Lookup tables to quickly get information
    this.days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.monthName = ['January', 'Feburary', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  }

  componentDidMount() {
    this.setReservedData(this.props.id, this.props.month, this.props.year);
  }

  // Listener methods

  // If neither check day has been set, set the check in date
  // If checkIn has been set, set the checkout date
  onCellClick(month, year, event) {
    // Validate the date is correct, first by checking the event target text
    const day = Number.parseInt(event.target.textContent, 10);

    if (day && !this.state.reservedSet.has(day)) {
      const clickDate = new Date(year, month, day);
      const midnightTmw = new Date().setHours(24, 0, 0, 0);

      // Don't highlight a date if not bookable
      if (!this.isRangeBookable(new Date(this.props.checkinDay).getDate(), clickDate.getDate())) {
        return;
      }

      if (clickDate.getTime() > midnightTmw) {
        // Determine whether to set this date as check out or check in
        let isCheckIn = this.state.isChoosingCheckIn;
        if (this.props.checkoutDay && this.props.checkoutDay <= clickDate.getTime()) {
          isCheckIn = false;
        }

        if (this.props.checkinDay && this.props.checkinDay >= clickDate.getTime()) {
          isCheckIn = true;
        }

        this.setState({
          isChoosingCheckIn: !isCheckIn,
        });

        this.props.onChangeDate(isCheckIn, clickDate.getTime());
      }
    }
  }

  // If date is valid, save the current date being hovered over
  onCellEnter(month, year, event) {
    const day = Number.parseInt(event.target.textContent, 10);

    // Do not set the hovered date when check out day is being selected but no check in day set
    if ((day && this.state.isChoosingCheckIn) || (day && !this.state.isChoosingCheckIn && this.props.checkinDay)) {
      this.setState({
        currHovered: new Date(year, month, day).getTime(),
      });
    }
  }

  // Does not change whether the user is checking in or out
  onClear() {
    this.setState({
      currHovered: null,
    });

    this.props.resetDates();
  }

  setCheckinState(isCheckInDate) {
    this.setState({
      isChoosingCheckIn: isCheckInDate,
    });
  }

  // Helper methods

  // Update reservations, called by parent component or when mounted
  setReservedData(id, month, year) {
    Calendar.loadReserved(id, month, year)
      .then((reservedSet) => {
        this.setState({
          reservedSet,
        });
      });
  }

  // Return an 2-D array, seven elements for each row that
  // indicates the month day number for each week day.
  getCellInfo(month, year) {
    const result = [];
    const firstDay = Calendar.firstDayOfWeekFor(month, year);
    const lastDay = this.daysInMonth[month];
    let day = 0 - firstDay + 1; // firstDay - 1 iterations before adding days

    const currDate = new Date(year, month);
    const midnightTmw = new Date().setHours(24, 0, 0, 0);

    // Update the date for the day being inserted, then determine
    // if the date is in the past. Also check if six rows needed
    const rows = firstDay + lastDay > CELL_THRESHOLD ? SIX_WEEK_ROWS : WEEK_ROWS;
    for (let i = 0; i < rows; i += 1) {
      const week = [];
      for (let j = 0; j < DAY_COLS; j += 1) {
        if (day >= 1 && day <= lastDay) {
          currDate.setDate(day);
        }

        // Determine the CSS class for the cell. This allows it to respond to hovering,
        // show as selected, past today, or reserved
        const currTime = currDate.getTime();
        const dayVal = day < 1 || day > lastDay ? null : day;
        let css = currTime < midnightTmw && dayVal ? 'checkout-2 checkoutCell checkoutPast' : 'checkout-2 checkoutCell';

        if (this.state.reservedSet.has(dayVal)) {
          css += ' checkoutReserved';
        } else if (dayVal && this.props.checkinDay && currTime > this.props.checkinDay
          && currTime < this.props.checkoutDay) {
          css += ' checkoutReserveRange';
        } else if ((dayVal && currTime === this.props.checkinDay)
          || currTime === this.props.checkoutDay) {
          css += ' checkoutReserveEnd';
        } else if (dayVal && !this.state.isChoosingCheckIn && this.state.currHovered
          && currTime >= this.props.checkinDay && currTime <= this.state.currHovered
          && this.isRangeBookable(new Date(this.props.checkinDay).getDate(), currDate.getDate())) {
          css += ' checkoutSelection';
        } else if (dayVal && currTime >= midnightTmw) {
          css += ' checkoutAvailable';
        }

        week.push({ day: dayVal, css });
        day += 1;
      }
      result.push(week);
    }

    return result;
  }

  // Determine if a range contains a reserved day
  // TODO: Refactor with bit vector to make it faster
  isRangeBookable(start, end) {
    for (let i = start; i <= end; i += 1) {
      if (this.state.reservedSet.has(i)) {
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <div id={this.props.small ? 'checkoutMaxWidth' : null} className='checkoutCard checkoutContainer'>
        <CalendarHeader
          btnClick={this.props.btnClick}
          monthName={this.monthName}
          month={this.props.month}
          year={this.props.year}
        />

        <div className="checkoutCalRow">
          { this.days.map(day => (<div className="checkout-2 checkoutWeekDay">{day}</div>)) }
        </div>

        {/* Render each day by inserting one week at a time.
          Days before and after the month have empty cells */
          this.getCellInfo(this.props.month, this.props.year).map(week => (
            <div className="checkoutCalRow checkoutCalRow">
              { /* if day is null, nothing gets rendered */
                week.map(obj => (
                  <div
                    className={obj.css}
                    onClick={this.onCellClick.bind(this, this.props.month, this.props.year)}
                    onMouseEnter={this.onCellEnter.bind(this, this.props.month, this.props.year)}
                  >
                    {obj.day}
                  </div>
                ))
              }
            </div>
          ))
        }

        <CalendarFooter
          lastUpdated="Updated 3 days ago"
          onClear={this.onClear.bind(this)}
        />
      </div>
    );
  }
}

Calendar.propTypes = {
  small: PropTypes.bool,
  id: PropTypes.string.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  btnClick: PropTypes.func.isRequired,
  initCheckin: PropTypes.bool.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  checkinDay: PropTypes.number,
  checkoutDay: PropTypes.number,
  resetDates: PropTypes.func.isRequired,
};

Calendar.defaultProps = {
  small: false,
  checkinDay: null,
  checkoutDay: null,
};

export { CalendarHeader, CalendarFooter };
