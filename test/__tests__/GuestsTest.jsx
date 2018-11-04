import { shallow, mount, render } from 'enzyme';
import React from 'react';

import Guests from '../../client/components/Guests';

// Test variables used as dependency injection for the Guest props,
// the component does not need to know or care what is passed into it.

let quantity = 0;

const left = function left() {
  quantity -= 1;
};

const right = function right() {
  quantity += 1;
};

// Unused prop for now
const close = function close() {

};

beforeEach(() => {
  quantity = 0;
});

describe('Guests component test suite', () => {
  it('should be selectable by class "guests"', () => {
    // Shallow will render the component but not its children components.
    const shallowComp = shallow(
      <Guests
        adults={0}
        childrenNum={0}
        infants={0}
        limit={10}
        total={0}
        leftBtn={left}
        rightBtn={right}
        close={close}
      />,
    );
    expect(shallowComp.is('#guests')).toBe(true);
  });

  it('should mount in a full DOM and have seven buttons', () => {
    const comp = mount(
      <Guests
        adults={0}
        childrenNum={0}
        infants={0}
        limit={10}
        total={0}
        leftBtn={left}
        rightBtn={right}
        close={close}
      />,
    );

    // Just call find to determine the number of certain DOM elements.
    expect(comp.find('#guests').length).toBe(1);
    expect(comp.find('button').length).toBe(7);
  });

  it('should gray out buttons when limit is reached', () => {
    const comp = mount(
      <Guests
        adults={0}
        childrenNum={0}
        infants={0}
        limit={10}
        total={0}
        leftBtn={left}
        rightBtn={right}
        close={close}
      />,
    );

    // Find the plus button in the adults row, and call its onClick function
    const adultPlusBtn = comp.find('.btn-outline-primary').at(1);
    for (let i = 0; i < 10; i += 1) {
      adultPlusBtn.simulate('click');

      // Because setState isn't being called here, we need to
      // update the props ourselves like setState.
      comp.setProps({ adults: quantity, total: quantity });
    }

    // Check that the button has the disabled class
    comp.update();
    const disabledBtn = comp.find('.btn-outline-primary.disabled');
    expect(disabledBtn.length).toBeGreaterThan(0);
  });

  it('should render to static HTML', () => {
    const rowString = 'Adults';
    const rendered = render(
      <Guests
        adults={0}
        childrenNum={0}
        infants={0}
        limit={10}
        total={5}
        leftBtn={left}
        rightBtn={right}
        close={close}
      />,
    );
    expect(rendered.text().indexOf(rowString)).toBeGreaterThan(-1);
  });
});
