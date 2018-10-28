import React from 'react';

export default class CheckoutCalendar extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className={this.props.small ? 'card container checkoutMaxWidth' : 'card container'}>
        <div className='row'>
          <div className='col-md-3'>
            <button className='btn btn-sm btn-outline-primary'>←</button>
          </div>
          <div className='col-md-6 checkoutCenterText'>
            <strong>July 2018</strong>
          </div>
          <div className='col-md-3'>
            <button className='btn btn-sm btn-outline-primary checkoutFloatRight'>→</button>
          </div>
        </div>
        
        <ul>
          { days.map(day => ( <li className='checkoutWeekDay'>{day}</li> )) }
        </ul>
        
        <div className='row'>
          <div className='col-md-8'>
            Updated 3 days ago
          </div>
          <div className='col-md-4'>
            <button className='btn btn-outline-primary checkoutFloatRight'>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}
