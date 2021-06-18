import React from 'react';
import InputBase from '../InputBase/InputBase.jsx'
import './Form.css';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <h1>Add New Card</h1>
        <form action="">
          <InputBase />
          <InputBase />
          <InputBase />
          <InputBase />
          <div>
          <InputBase type="submit" value="Add Card"/>
          </div>
        </form>
      </div>
    )
  }

}

export default Form;