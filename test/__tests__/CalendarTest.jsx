import {mount} from 'enzyme';
import React from 'react';
import fetch from 'isomorphic-fetch';

import Calendar from '../../client/components/Calendar.jsx';
import {CalendarHeader, CalendarFooter} from '../../client/components/Calendar.jsx';

// Define variables and functions here to be dependency injected to each component as props
let monthName = ['January', 'Feburary', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let month = 8;
let year = 2018;
let checkinDay = null;
let checkoutDay = null;

let expectedNights;
      
let onBtnClick = function(left) {
  month += 1;
  if (month === 13) {
    month = 0;
    year += 1;
  }
};

let onChangeDate = function(isCheckIn, timeStamp) {
  let nights = null;
  if (checkinDay && !isCheckIn) {
    nights = (timeStamp - checkinDay) / 86400000;
  }

  expectedNights = nights;

  if (isCheckIn) {
    checkinDay = timeStamp;
  } else {
    checkoutDay = timeStamp;
  }
};

let onReset = function() {
  checkinDay = null;
  checkoutDay = null;
};

describe('Calendar component test suite', function() {
  it('should move to different months and year when a button is pressed for the header', function() {
    let header = mount(
      <CalendarHeader btnClick={onBtnClick} monthName={monthName} month={month} year={year} />
    );

    // Find the right button, simulate presses
    let rightBtn = header.find('.checkoutFloatRight');
    rightBtn.simulate('click');

    // Re-render, verify
    expect(month).toBe(9);

    // Press button 4 times, check calendar goes into 2019
    rightBtn = header.find('.checkoutFloatRight');
    for (let i = 0; i < 4; i += 1) {
      rightBtn.simulate('click');
    }

    header.setProps({month, year});
    header.update();
    expect(year).toBe(2019);

    const text = header.find('.checkoutCenterText');
    const resultText = text.find('strong').props().children;
    expect(resultText).toBe('January 2019');
  });
  
  it('should display the correct number of rows based on the month', function() {
    const calendar = mount(
      <Calendar small id={0} month={8} year={2018} 
        btnClick={onBtnClick} initCheckin={true} />
    );
    
    // Locate the right sided button by selecting with two classes, simulate clicks
    const rightBtn = calendar.find('.btn-sm.checkoutFloatRight');
    
    // Find the number of calendar rows, verify the correct number based on the current month
    let rows = calendar.find('.checkoutCalRow');
    expect(rows.length).toBe(6); // September 2018 has 6 rows in the calendar
    
    // Click, update props
    rightBtn.simulate('click');
    calendar.setProps({month, year});
    calendar.update();

    rows = calendar.find('.checkoutCalRow');
    expect(rows.length).toBe(5); // October 2018 has 5 rows in the calendar
  });

  it('should display dashes on all cells before today', function() {
    const thisMonth = new Date().getMonth();
    
    const calendar = mount(
      <Calendar small id={0} month={thisMonth - 2} year={2018} 
        btnClick={onBtnClick} initCheckin={true} />
    );
    
    let dashedCells = calendar.find('.checkoutCell.checkoutPast');
    expect(dashedCells.length).toBe(daysInMonth[thisMonth - 2]);
  });
  
  it('should allow booking a date range and be able to have it reset', function() {
    const calendar = mount(
      <Calendar small id={0} month={10} year={2018} 
        btnClick={onBtnClick} initCheckin={true}
        onChangeDate={onChangeDate} checkinDay={null} checkoutDay={null}
        resetDates={onReset} />
    );

    // Get the 10th and 15th cell and simulate clicks
    let first = calendar.find('.checkoutAvailable').at(9);
    first.simulate('click');
    calendar.setProps({checkinDay});
    calendar.update();

    let second = calendar.find('.checkoutAvailable').at(14);
    second.simulate('click');
    calendar.setProps({checkoutDay});
    calendar.update();

    const firstDate = new Date(checkinDay).getDate();
    const secondDate = new Date(checkoutDay).getDate();
    expect(firstDate).toBe(10);
    expect(secondDate).toBe(16);
    expect(secondDate - firstDate).toBe(expectedNights);
    
    // Reset booking
    let btn = calendar.find('.checkoutFloatRight').at(1);
    btn.simulate('click');
    
    expect(checkinDay).toBe(null);
    expect(checkoutDay).toBe(null);
  });
  
  it('should show selected cells when hovering over a cell', function() {
    const calendar = mount(
      <Calendar small id={0} month={10} year={2018} 
        btnClick={onBtnClick} initCheckin={true}
        onChangeDate={onChangeDate} checkinDay={null} checkoutDay={null}
        resetDates={onReset} />
    );
    
    let first = calendar.find('.checkoutAvailable').at(9);
    first.simulate('click');
    calendar.setProps({checkinDay});
    calendar.update();
    
    // Hover over the 16th cell, which is now the 15th cell with checkoutAvailable class
    let second = calendar.find('.checkoutAvailable').at(14);
    second.simulate('mouseEnter');
    calendar.update();
    
    // All cells from the selection date to and including the hovered cell are selected
    expect(calendar.find('.checkoutSelection').length).toBe(6);
  });
});
