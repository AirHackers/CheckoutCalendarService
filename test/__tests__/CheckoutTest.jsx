import {shallow, mount} from 'enzyme';
import React from 'react';
import fetch from 'isomorphic-fetch';

import Checkout from '../../client/components/CheckoutCalendar.jsx';
import Breakdown from '../../client/components/Breakdown.jsx';

const ADULTS = 0, CHILDREN = 1, INFANTS = 2;

// Mock window.addEventListener so that it works in tests
const map = {};
document.addEventListener = jest.fn((event, cb) => {
  map[event] = cb;
});

describe('Checkout component test suite', function() {
  it('should show the popover only when the inputs are clicked', function() {
    const comp = mount(
      <Checkout small match={ {params: {id: 1}} } />
    );

    // Get the check in input, click
    let checkIn = comp.find('.form-control').at(0);

    // Check the component state to see if it is active
    checkIn.simulate('click');

    comp.update();
    expect(comp.state('anchorEl')).toBeDefined();

    // Because the popover is not a child of the CheckoutCalendar component, call the handleClose function.
    comp.instance().handleClose();

    comp.update();
    expect(comp.state('anchorEl')).toBeNull();
  });

  // Similar to an end-to-end test, but it only calls prop methods
  it('should show the breakdown only when check in and out dates exist', function() {
    const comp = shallow(
      <Checkout small match={ {params: {id: 1}} } />
    );

    // We can't access the popover directly, so invoke prop methods to set dates to October 24 to 27, 2018
    // Also use the Breakdown class as a selector
    comp.instance().onChangeDate(true, 1540339200000)
    comp.update();
    expect(comp.find(Breakdown).length).toBe(0);

    comp.instance().onChangeDate(false, 1540598400000)
    comp.update();
    expect(comp.find(Breakdown).length).toBe(1);
  });

  it('should update the inputs when dates are selected', function() {
    const comp = shallow(
      <Checkout small match={ {params: {id: 1}} } />
    );

    const checkInDate = new Date(1540339200000);
    const checkOutDate = new Date(1540598400000);

    comp.instance().onChangeDate(true, checkInDate.getTime());
    comp.update();

    comp.instance().onChangeDate(false, checkOutDate.getTime());
    comp.update();

    const inputs = comp.find('.form-control');

    const checkInText = inputs.at(0).props().value;
    const checkOutText = inputs.at(1).props().value;
    expect(checkInText).toBe(checkInDate.toLocaleDateString());
    expect(checkOutText).toBe(checkOutDate.toLocaleDateString());
  });

  it('should update the month and year when button props are triggered', function() {
    const comp = mount(
      <Checkout small match={ {params: {id: 1}} } />
    );

    let startMonth = comp.state('month');

    // Trigger the prop for the left Popover button and verify the changed month
    for (let i = 0; i < 3; i++) {
      comp.instance().onCalBtnClick(true);
    }

    comp.update();
    expect(comp.state('month')).toBe(startMonth - 3);

    // Go back to the original month
    for (let i = 0; i < 3; i++) {
      comp.instance().onCalBtnClick(false);
    }

    comp.update();
    expect(comp.state('month')).toBe(startMonth);
  });

  // Does not test for the text in the guest read-only input, that belongs in an end-to-end test.
  it('update the number of guests and adhere to the current limit', function() {
    const comp = mount(
      <Checkout small match={ {params: {id: 1}} } />
    );

    // Currently the limit is 10
    let limit = comp.state('limit');

    // Trigger props to change the number of guests
    for (let i = 0; i < 5; i++) {
      comp.instance().rightBtnFor(ADULTS);
      comp.instance().rightBtnFor(CHILDREN);
    }

    let currGuests = comp.state('guests');
    expect(currGuests[0] + currGuests[1]).toBe(limit);

    // Try to add more adults, but verify nothing changed.
    for (let i = 0; i < 5; i++) {
      comp.instance().rightBtnFor(ADULTS);
    }

    currGuests = comp.state('guests');
    expect(currGuests[0] + currGuests[1]).toBe(limit);

    // Remove children, verify five adults and 1 from the beginning
    for (let i = 0; i < 10; i++) {
      comp.instance().leftBtnFor(CHILDREN);
    }
    currGuests = comp.state('guests');
    expect(currGuests[0] + currGuests[1]).toBe(6);
  });

  // End to end test that verifies interaction between the Checkout and Guest component
  it('should close the guest component (and update price)', function() {
    const comp = mount(
      <Checkout small match={ {params: {id: 1}} } />
    );

    // Open the guests component and close it by clicking the close button
    let guestInput = comp.find('#guestText');
    guestInput.simulate('click');

    comp.update();
    expect(comp.find('#guests').length).toBe(1);
    comp.find('.btn.btn-outline-primary.checkoutFloatRight').simulate('click');

    comp.update();
    expect(comp.find('#guests').length).toBe(0);

    // Close guests component by click outside guests component
    guestInput = comp.find('#guestText');
    guestInput.simulate('click');
    comp.update();
  });
});