import React from 'react';
import './InputBase.css';
import { CARD, CARDICON } from '../constants';

const InputBase = ({errorMessage, error, cardType, isCard, ...props}) => (
  <label>
    <input className="input-root" {...props} />
    {errorMessage && <div className="error">{errorMessage}</div>}
    {(!error || !error.cardError) && isCard && CARD.includes(cardType) && (
      <img 
      style={{
        position: 'absolute',
        top:"5px",
        right: "10px",
        width: "50px",
        height: "33px",
      }}
      src={CARDICON[cardType]} 
      alt="card"/>
    )}
  </label>
)

export default InputBase;