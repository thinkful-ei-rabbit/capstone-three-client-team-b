import React from 'react';
import { Section } from '../../components/Utils/Utils';
import { Link } from 'react-router-dom';

import './LandingPage.css';

export default function LandingPage() {
  const designers = ['Caleb,', 'Harry,', 'Malik,', 'Michael,', 'and Jason.'];
  const nameString = designers
    .map((name) => <strong>{name + ' '}</strong>)
    .concat();
  console.log(nameString);
  return (
    <Section>
      <div className="container">
        <h1>Ahoy there!</h1>
        <p>Welcome to GoFish.io.</p>
        <p>
          Here you can play the classic card game “Go Fish” online with up to 3
          other friends in an online environment.
        </p>
        <p>GoFish.io is a collaborative project built by {nameString}</p>
        <p>.</p>
        <Link to="/register">Register</Link>
      </div>
    </Section>
  );
}
