import React from 'react';

const WEEK_ROWS = 6, DAY_COLS = 7;

export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);

    // Month and days are 0-indexed!
    this.state = {
      month: 8,
      year: 2018,
      daysInMonth: 31,
      firstWeekDay: 6,
      checkinDay: null,
      checkoutDay: null
    };

    // Lookup tables to quickly get information
    this.days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.monthName = ['January', 'Feburary', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  }

  firstDayOfWeekFor(month, year) {
    return new Date(year, month).getDay();
  }

  onBtnClick(left) {
    var month = this.state.month;
    var year = this.state.year;

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
  }
  
  onClear(event) {
    this.setState({
      checkinDay: null,
      checkoutDay: null
    });
  }

  // Return an 2-D array, seven elements for each row that indicates the month day number for each week day.
  getCellInfo(month, year) {
    let result = [];
    let firstDay = this.firstDayOfWeekFor(month, year);
    let lastDay = this.daysInMonth[month];
    let day = 0 - firstDay + 1; // firstDay - 1 iterations before adding days
    
    let currDate = new Date(year, month);
    let midnightToday = new Date().setHours(0,0,0,0);

    // Update the date for the day being inserted, then determine
    // if the date is in the past.
    for (let i = 0; i < WEEK_ROWS; i += 1) {
      let week = [];
      for (let j = 0; j < DAY_COLS; j += 1) {
        if (day >= 1 && day <= lastDay) {
          currDate.setDate(day);
        }

        let css = currDate.getTime() < midnightToday ? 'col checkoutPast' : 'col checkoutCell';

        week.push({day: day < 1 || day > lastDay ? null : day, css});
        day += 1;
      }
      result.push(week);
    }
    
    return result;
  }

  render() {
    return (
      <div className={this.props.small ? 'card container checkoutMaxWidth' : 'card container'}>
        <div className='row'>
          <div className='col-md-3'>
            <button className='btn btn-sm btn-outline-primary' onClick={this.onBtnClick.bind(this, true)}>←</button>
          </div>
          <div className='col-md-6 checkoutCenterText'>
            <strong>{`${this.monthName[this.state.month]} ${this.state.year}`}</strong>
          </div>
          <div className='col-md-3'>
            <button className='btn btn-sm btn-outline-primary checkoutFloatRight' onClick={this.onBtnClick.bind(this, false)}>→</button>
          </div>
        </div>

        <div className='row'>
          { this.days.map(day => ( <div className='col checkoutWeekDay'>{day}</div> )) }
        </div>

        {/* Render each day by inserting one week at a time. Days before and after the month have empty cells */
          this.getCellInfo(this.state.month, this.state.year).map(week => (
            <div className='row'>
              { /* if day is null, nothing gets rendered */
                week.map(obj => ( <div className={obj.css}>{obj.day}</div> ))
              }
            </div>
          ))
        }

        <div className='row'>
          <div className='col-md-8'>
            Updated 3 days ago
          </div>
          <div className='col-md-4'>
            <button className='btn btn-outline-primary checkoutFloatRight' onClick={this.onClear.bind(this)}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}
