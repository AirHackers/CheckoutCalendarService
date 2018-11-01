import {mount} from 'enzyme';
import React from 'react';
import fetch from 'isomorphic-fetch';

import Checkout from '../../client/components/CheckoutCalendar.jsx';
import Breakdown from '../../client/components/Breakdown.jsx';

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
    debugger;
    // Because the popover is not a child of the CheckoutCalendar component, call the handleClose function.
    comp.instance().handleClose();

    comp.update();
    expect(comp.state('anchorEl')).toBeNull();
  });

  it('should show the breakdown only when check in and out dates exist', function() {
    const comp = mount(
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
    const comp = mount(
      <Checkout small match={ {params: {id: 1}} } />
    );

  });

  it('should close the guest component in three different ways', function() {
    const comp = mount(
      <Checkout small match={ {params: {id: 1}} } />
    );

  });
});
