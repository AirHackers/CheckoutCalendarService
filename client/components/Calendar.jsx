import React from 'react';

const WEEK_ROWS = 5, SIX_WEEK_ROWS = 6, DAY_COLS = 7, CELL_THRESHOLD = 35;
const server = 'http://127.0.0.1:3004/';

const CalendarHeader = props => (
  <div className='row checkoutKeylinesTop'>
    <div className='col-md-3'>
      <button className='btn btn-sm btn-outline-primary' onClick={props.onBtnClick.bind(this, true)}>←</button>
    </div>
    <div className='col-md-6 checkoutCenterText'>
      <strong>{`${props.monthName[props.month]} ${props.year}`}</strong>
    </div>
    <div className='col-md-3'>
      <button className='btn btn-sm btn-outline-primary checkoutFloatRight' onClick={props.onBtnClick.bind(this, false)}>→</button>
    </div>
  </div>
);

const CalendarFooter = props => (
  <div className='row checkoutKeylines'>
    <div className='col-md-8'>{props.lastUpdated}</div>
    <div className='col-md-4'>
      <button className='btn btn-outline-primary checkoutFloatRight' onClick={props.onClear}>Clear</button>
    </div>
  </div>
);

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    // Month and days are 0-indexed!
    this.state = {
      month: 8,
      year: 2018,
      daysInMonth: 31,
      firstWeekDay: 6,
      isChoosingCheckIn: true,
      checkinDay: null,
      checkoutDay: null,
      currHovered: null,
      reservedSet: new Set()
    };

    // Lookup tables to quickly get information
    this.days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.monthName = ['January', 'Feburary', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  }

  // Access reserved API and return a set with all reserved data in the month in a Promise.
  loadReserved(id, month, year) {
    return fetch(`${server}/api/listings/${id}/reserved?month=${month}&year=${year}`)
    .then(response => response.json())
    .then(reservations => {
      // Fill reserved set with all dates for each range
      let reservedSet = new Set();
      for (let pair of reservations) {
        for (let i = pair[0]; i <= pair[1]; i++) {
          reservedSet.add(i);
        }
      }

      return reservedSet;
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentDidMount() {
    this.loadReserved(this.props.id, this.state.month, this.state.year)
    .then(reservedSet => {
      this.setState({
        reservedSet
      });
    });
  }

  // Listener methods

  onBtnClick(left) {
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

    // Update reservations
    this.loadReserved(this.props.id, month, year)
    .then(reservedSet => {
      this.setState({
        reservedSet
      });
    });
  }

  // If neither check day has been set, set the check in date
  // If checkIn has been set, set the checkout date
  onCellClick(month, year, event) {
    // Validate the date is correct, first by checking the event target text
    const day = Number.parseInt(event.target.textContent);

    if (day && !this.state.reservedSet.has(day)) {
      const clickDate = new Date(year, month, day);
      const midnightTmw = new Date().setHours(24, 0, 0, 0);
      
      // Don't highlight a date if not bookable
      if (!this.isRangeBookable(new Date(this.state.checkinDay).getDate(), clickDate.getDate())) {
        return;
      }

      if (clickDate.getTime() > midnightTmw) {
        // Determine whether to set this date as check out or check in
        let isCheckIn = this.state.isChoosingCheckIn;
        if (this.state.checkoutDay && this.state.checkoutDay <= clickDate.getTime()) {
          isCheckIn = false;
        }

        if (this.state.checkinDay && this.state.checkinDay >= clickDate.getTime()) {
          isCheckIn = true;
        }

        this.setState({
          isChoosingCheckIn: !isCheckIn,
          [ !isCheckIn ? 'checkoutDay' : 'checkinDay']: clickDate.getTime() // State key depends on whether check in day is set
        });
      }
    }
  }

  // If date is valid, save the current date being hovered over
  onCellEnter(month, year, event) {
    const day = Number.parseInt(event.target.textContent);

    if (day) {
      this.setState({
        currHovered: new Date(year, month, day).getTime()
      });
    }
  }

  onClear(event) {
    this.setState({
      isChoosingCheckIn: true,
      checkinDay: null,
      checkoutDay: null,
      currHovered: null
    });
  }

  // Helper methods

  firstDayOfWeekFor(month, year) {
    return new Date(year, month).getDay();
  }

  // Determine if a range contains a reserved day
  // TODO: Refactor with bit vector to make it faster
  isRangeBookable(start, end) {
    for (let i = start; i <= end; i++) {
      if (this.state.reservedSet.has(i)) {
        return false;
      }
    }
    return true;
  }

  // Return an 2-D array, seven elements for each row that indicates the month day number for each week day.
  getCellInfo(month, year) {
    let result = [];
    let firstDay = this.firstDayOfWeekFor(month, year);
    let lastDay = this.daysInMonth[month];
    let day = 0 - firstDay + 1; // firstDay - 1 iterations before adding days

    let currDate = new Date(year, month);
    let midnightTmw = new Date().setHours(24, 0, 0, 0);

    // Update the date for the day being inserted, then determine
    // if the date is in the past. Also check if six rows needed
    let rows = firstDay + lastDay > CELL_THRESHOLD ? SIX_WEEK_ROWS : WEEK_ROWS;
    for (let i = 0; i < rows; i += 1) {
      let week = [];
      for (let j = 0; j < DAY_COLS; j += 1) {
        if (day >= 1 && day <= lastDay) {
          currDate.setDate(day);
        }

        // Determine the CSS class for the cell. This allows it to respond to hovering, show as selected, past today, or reserved
        let currTime = currDate.getTime();
        let css = currTime < midnightTmw ? 'col checkoutCell checkoutPast' : 'col checkoutCell';
        let dayVal = day < 1 || day > lastDay ? null : day;
        if (this.state.reservedSet.has(dayVal)) {
          css += ' checkoutReserved';
        } else if (dayVal && currTime > this.state.checkinDay && currTime < this.state.checkoutDay) {
          css += ' checkoutReserveRange';
        } else if (dayVal && currTime === this.state.checkinDay || currTime === this.state.checkoutDay) {
          css += ' checkoutReserveEnd';
        } else if (dayVal && !this.state.isChoosingCheckIn && this.state.currHovered 
          && currTime >= this.state.checkinDay && currTime <= this.state.currHovered 
          && this.isRangeBookable(new Date(this.state.checkinDay).getDate(), currDate.getDate())) {
          css += ' checkoutSelection';
        } else if (dayVal && currTime >= midnightTmw) {
          css += ' checkoutAvailable';
        }

        week.push({day: dayVal, css});
        day += 1;
      }
      result.push(week);
    }

    return result;
  }

  render() {
    return (
      <div className={this.props.small ? 'card container checkoutMaxWidth' : 'card container'}>
        <CalendarHeader onBtnClick={this.onBtnClick.bind(this)} monthName={this.monthName} month={this.state.month} year={this.state.year} />

        <div className='row'>
          { this.days.map(day => ( <div className='col checkoutWeekDay'>{day}</div> )) }
        </div>

        {/* Render each day by inserting one week at a time. Days before and after the month have empty cells */
          this.getCellInfo(this.state.month, this.state.year).map(week => (
            <div className='row checkoutCalRow'>
              { /* if day is null, nothing gets rendered */
                week.map(obj => ( <div className={obj.css} onClick={this.onCellClick.bind(this, this.state.month, this.state.year)}
                onMouseEnter={this.onCellEnter.bind(this, this.state.month, this.state.year)} >{obj.day}</div> ))
              }
            </div>
          ))
        }

        <CalendarFooter lastUpdated={'Updated 3 days ago'} onClear={this.onClear.bind(this)} />
      </div>
    );
  }
}

export {CalendarHeader, CalendarFooter};
