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

  handleBlur = ({target: {name, value}}) => this.handleValidations(name, value);

  handleInputData = ({target: {name, value}}) => {

    if(name === 'card'){
      let mask = value.split(' ').join('');
      if(mask.length){
        mask = mask.match(new RegExp('.{1,4}', 'g')).join(' ');
        this.setState((prevState) => ({       
          cardData: { 
           ...prevState.cardData, 
            [name]: mask}
           }));
      } else {
        this.setState((prevState) => ({       
          cardData: { 
            ...prevState.cardData, 
            [name]: ''}
            }));
      }
    } else {
      this.setState((prevState) => ({       
        cardData: { 
          ...prevState.cardData, 
          [name]: value}
          }));
    }
  }

 checkErrorBeforeSave = () => {
   let errorValue = this.state.error;
   let isError = false; 
   const { cardData, error} = this.state; 

    //Check for existing errors
    Object.keys(error).forEach((value) => {
      if(error[value]?.length > 0){
       isError = true;
      }
    })

   Object.keys(cardData).forEach((value) => {
     if(!cardData[value].length){       
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
  const {cardData, cardType, error, maxLength} = this.state;

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
            value={cardData && cardData[item.name]} //Check for data before rendering
            onChange={this.handleInputData}
            autoComplete="off"
            maxLength={maxLength}
            name={item.name}
            onBlur={this.handleBlur}
            error={error}
            cardType={cardType}
            isCard={ item.name === 'card'}
            errorMessage={
              (error                                 // Object exists
              && error[item.error]                   // Property exists
              && error[item.error].length > 1)       // Message is present
              ? error[item.error]                    // Error message
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