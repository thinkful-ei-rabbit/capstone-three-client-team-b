import react from 'react';
import logo from './logo.png';


export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="logo" />
      <span className="logo-text">GoFish.io</span>    
    </div>
  );
}