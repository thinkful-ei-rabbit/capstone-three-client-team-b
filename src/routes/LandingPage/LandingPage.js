import React, { Component } from 'react';
import { Button, Section } from '../../components/Utils/Utils';
import { Link } from 'react-router-dom';

import './LandingPage.css';

export default function LandingPage() {
  
    return (
      <Section>
        <div className="container">

          <h1>Ahoy there!</h1>
          <p>Welcome to GoFish.io.</p>
          <p>Here you can play the classic card game “Go Fish” online with up to 3 other friends in an online environment.</p>
          <p>GoFish.io is a collaborative product put together by Caleb, Harry, Jason, Malik, Michael, and Jason.</p>
          <p>.</p>
          <Link to="/register">Register</Link>
        </div>

      </Section>
    );
  
}
