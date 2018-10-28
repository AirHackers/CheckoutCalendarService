import { shallow, mount, render } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import Guests from '../../client/components/Guests.jsx';

// Test variables used as dependency injection for the Guest props,
// the component does not need to know or care what is passed into it.

var quantity = 0;

var left = function() {
  quantity--;
};

var right = function() {
  quantity++;
};

beforeEach(() => {
  quantity = 0;
});

describe('Guests component test suite', function() {
  it('should be selectable by class "guests"', function() {
    // Shallow will render the component but not its children components.
    var shallowComp = shallow(
      <Guests input='Adults' quantity={5} total={5} limit={10} idx={0} 
        leftBtn={left} rightBtn={right} />
    );
    expect(shallowComp.is('#guests')).toBe(true);
  });

  it('should mount in a full DOM and have seven buttons', function() {
    var comp = mount((
      <Guests adults={0} children={0} infants={0} limit={10} total={0} 
        leftBtn={left} rightBtn={right} />
    ));
    
    // Just call find to determine the number of certain DOM elements.
    expect(comp.find('#guests').length).toBe(1);
    expect(comp.find('button').length).toBe(7);
  });
  
  it('should gray out buttons when limit is reached', function() {
    var comp = mount((
      <Guests adults={0} children={0} infants={0} limit={10} total={0} 
        leftBtn={left} rightBtn={right} />
    ));
    
    // Find the plus button in the adults row, and call its onClick function
    var adultPlusBtn = comp.find('.btn-outline-primary').getElements()[1];
    for (var i = 0; i < 10; i++) {
      adultPlusBtn.props.onClick();
      
      // Because setState isn't being called here, we need to update the props ourselves like setState.
      comp.setProps({adults: quantity, total: quantity});
    }
    
    // Check that the button has the disabled class
    comp.update();
    adultPlusBtn = comp.find('.btn-outline-primary').getElements()[1];
    expect(adultPlusBtn.props.className.indexOf('disabled')).toBeGreaterThan(-1);
  });

  it('should render to static HTML', function() {
    var rowString = 'Adults';
    var rendered = render((
      <Guests adults={0} children={0} infants={0} limit={10} total={5} 
        leftBtn={left} rightBtn={right} />
    ));
    expect(rendered.text().indexOf(rowString)).toBeGreaterThan(-1);
  });
});
