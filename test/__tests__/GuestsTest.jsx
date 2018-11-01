import { shallow, mount, render } from 'enzyme';
import React from 'react';

import Guests from '../../client/components/Guests';

// Test variables used as dependency injection for the Guest props,
// the component does not need to know or care what is passed into it.

let quantity = 0;

const left = function () {
  quantity -= 1;
};

const right = function () {
  quantity += 1;
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
        children={0}
        infants={0}
        limit={10}
        total={0}
        leftBtn={left}
        rightBtn={right}
      />,
    );
    expect(shallowComp.is('#guests')).toBe(true);
  });

  it('should mount in a full DOM and have seven buttons', () => {
    const comp = mount(
      <Guests
        adults={0}
        children={0}
        infants={0}
        limit={10}
        total={0}
        leftBtn={left}
        rightBtn={right}
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
        children={0}
        infants={0}
        limit={10}
        total={0}
        leftBtn={left}
        rightBtn={right}
      />,
    );

    // Find the plus button in the adults row, and call its onClick function
    let adultPlusBtn = comp.find('.btn-outline-primary').at(1);
    for (let i = 0; i < 10; i += 1) {
      adultPlusBtn.simulate('click');

      // Because setState isn't being called here, we need to
      // update the props ourselves like setState.
      comp.setProps({ adults: quantity, total: quantity });
    }

    // Check that the button has the disabled class
    comp.update();
    adultPlusBtn = comp.find('.btn-outline-primary').getElements()[1];
    expect(adultPlusBtn.props.className.indexOf('disabled')).toBeGreaterThan(-1);
  });

  it('should render to static HTML', () => {
    const rowString = 'Adults';
    const rendered = render(
      <Guests
        adults={0}
        children={0}
        infants={0}
        limit={10}
        total={5}
        leftBtn={left}
        rightBtn={right}
      />,
    );
    expect(rendered.text().indexOf(rowString)).toBeGreaterThan(-1);
  });
});
