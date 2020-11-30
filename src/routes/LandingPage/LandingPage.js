import React, { Component } from 'react';
import { Button, Section } from '../../components/Utils/Utils';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo/Logo'

import './LandingPage.css';

export default function LandingPage(props) {
  
    return (
      <Section className="body">
        <div className="container">
          <Logo />
          <h1>welcome to the landing page</h1>
          <Link to="/register">Register</Link>
        </div>

      </Section>
    );
  
}
