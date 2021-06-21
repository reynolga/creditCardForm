import React from 'react';
import InputBase from '../InputBase/InputBase.jsx';
import './Form.css';
import {OTHERCARDS} from '../constants';
import {cardNumberValidation, onlyTextValidation, securityCodeValidation, cardExpireValidation} from '../validations'

const INIT_CARD = {  
    card: '',
    cardHolder: '',
    expiry: '',
    securityCode: '',  
}
const MIN_SECURITY_LENGTH = 3;
class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      cardData: INIT_CARD,
      maxLength: OTHERCARDS.length,
      error: {},
      cardType: null,
    }
  }
   
  findDebitCardType = (cardNumber) => {
    const regexPattern = {
      MASTERCARD: /^5[1-5][0-9]{1,}|^2[2-7][0-9]{1,}$/,
      VISA: /^4[0-9]{5,}$/,
      AMERICAN_EXPRESS: /^3[47][0-9]{5,}$/,
      DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
    };
    for(const card in regexPattern){
      if(cardNumber.replace(/[^\d]/g, '').match(regexPattern[card])) return card;      
    }
    return '';
  }

  handleValidations = (type, value) => {
    let errorText = '';

     switch (type) {
       case 'card':
        errorText = cardNumberValidation(value);
         this.setState((prevState)=> ({          
            cardType: this.findDebitCardType(value),
            error: {
              ...prevState.error,
              cardError: errorText,
            }           
         }))
         break;
       case 'cardHolder':
        errorText = onlyTextValidation(value);  
         this.setState((prevState)=> ({
          error: {
            ...prevState.error,
            cardHolderError: errorText,
          } 
         }))
         break;
       case 'expiry':
        errorText = cardExpireValidation(value);  
        this.setState((prevState)=> ({
         error: {
           ...prevState.error,
           expiryError: errorText,
         } 
        }))
         break;
      case 'securityCode':
        errorText = securityCodeValidation(MIN_SECURITY_LENGTH, value);  
        this.setState((prevState)=> ({
         error: {
           ...prevState.error,
           securityCodeError: errorText,
         } 
        }))
         break;
      default:
        break;

     }
  }

  handleBlur = (e) => this.handleValidations(e.target.name, e.target.value);

  handleInputData = (e) => {

    if(e.target.name === 'card'){
      let mask = e.target.value.split(' ').join('');
      if(mask.length){
        mask = mask.match(new RegExp('.{1,4}', 'g')).join(' ');
        this.setState((prevState) => ({       
          cardData: { 
           ...prevState.cardData, 
            [e.target.name]: mask}
           }));
      } else {
        this.setState((prevState) => ({       
          cardData: { 
            ...prevState.cardData, 
            [e.target.name]: ''}
            }));
      }
    } else {
      this.setState((prevState) => ({       
        cardData: { 
          ...prevState.cardData, 
          [e.target.name]: e.target.value}
          }));
    }
  }

 checkErrorBeforeSave = () => {
   let errorValue = {};
   let isError = false; 

   Object.keys(this.state.cardData).forEach((value) => {
     if(!this.state.cardData[value].length){       
        errorValue = { ...errorValue, [`${value}Error`]: 'Required'};
        isError = true;
     }
   })

   this.setState({ error:errorValue });
   return isError;
 }

  handleAddCard = (e) => {
    e.preventDefault();

    const errorCheck = this.checkErrorBeforeSave();

    if(!errorCheck){
      this.setState({
        cardData: INIT_CARD,
        cardType: null
      })
    }
  }

  render() {

    const inputData = [
      { label: 'Card Number',         name:'card',         type:'text', error: 'cardError' },
      { label: 'CardHolder\'s Name',  name:'cardHolder',   type:'text', error: 'cardHolderError' },
      { label: 'Expiry Date (MM/YY)', name:'expiry',       type:'text', error: 'expiryError' },
      { label: 'Security Code',       name:'securityCode', type:'text', error: 'securityCodeError' },
    ]
    console.log(inputData.length);

    return (
      <div>
        <h1>Add New Card</h1>
        <form onSubmit={this.handleAddCard}>
          {inputData.length ? inputData.map((item) => {
            return <InputBase 
            placeholder={item.label}
            type={item.type}
            value={this.state.cardData && this.state.cardData[item.name]} //Check for data before rendering
            onChange={this.handleInputData}
            autoComplete="off"
            maxLength={this.state.maxLength}
            name={item.name}
            onBlur={this.handleBlur}
            error={this.state.error}
            cardType={this.state.cardType}
            isCard={ item.name === 'card'}
            errorMessage={
              (this.state.error                                 // Object exists
              && this.state.error[item.error]                   // Property exists
              && this.state.error[item.error].length > 1)       // Message is present
              ? this.state.error[item.error]                    // Error message
              : null
            }
            />
          }) : null}         
          <div>
          <InputBase type="submit" value="Add Card"/>
          </div>
        </form>
      </div>
    )
  }

}

export default Form;