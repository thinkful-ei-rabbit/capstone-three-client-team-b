import react from 'react';
import logo from './logo.png';


export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} alt="logo" style={{width: 100}}/>
      <span className="logo-text">GoFish.io</span>    
    </div>
  );
}