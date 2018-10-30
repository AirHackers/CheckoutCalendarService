import { shallow, mount, render } from 'enzyme';
import React from 'react';
import fetch from 'isomorphic-fetch';

import Calendar from '../../client/components/Calendar.jsx';
import {CalendarHeader, CalendarFooter} from '../../client/components/Calendar.jsx';

// Define variables and functions here to be dependency injected to each headeronent as props
let monthName = ['January', 'Feburary', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

let month = 8;
let year = 2018;
      
let onBtnClick = function(event) {
  month += 1;
  if (month === 13) {
    month = 0;
    year += 1;
  }
}

describe('Calendar headeronent test suite', function() {
  it('should move to different months and year when a button is pressed for the header', function() {
    let header = mount(
      <CalendarHeader onBtnClick={onBtnClick} monthName={monthName} month={month} year={year} />
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
    // TODO: Doesn't take props yet, this will need to be refactored too.
    const calendar = mount(
      <Calendar small />
    );
    
    // Locate the right sided button by selecting with two classes, simulate clicks
    const rightBtn = calendar.find('.btn-sm.checkoutFloatRight');
    
    // Find the number of calendar rows, verify the correct number based on the current month
    let rows = calendar.find('.checkoutCalRow');
    expect(rows.length).toBe(6); // September 2018 has 6 rows in the calendar
    
    rightBtn.simulate('click');
    calendar.update();
    
    rows = calendar.find('.checkoutCalRow');
    expect(rows.length).toBe(5); // October 2018 has 5 rows in the calendar
  });

});