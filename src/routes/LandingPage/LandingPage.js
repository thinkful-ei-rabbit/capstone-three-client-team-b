import React from 'react';
import { Section } from '../../components/Utils/Utils';
import { Link } from 'react-router-dom';
import fishy from '../../images/flavor/fishy.png'
import './LandingPage.css';

export default function LandingPage() {
  const designers = ['Caleb,', 'Harry,', 'Malik,', 'Michael,', 'and Jason.'];
  const nameString = designers
    .map((name) => <strong key={name}>{name + ' '}</strong>)
    .concat();
  return (
    <Section>

      <div className="landing container pop">
        <h1>Ahoy there!</h1>
        <p>Welcome to GoFish.io.</p>
        <p>
          Here you can play the classic card game “Go Fish” online with up to 3
          other friends at a virtual table.
        </p>
        <p>GoFish.io is a collaborative project built by {nameString}</p>
          <br />
          <br />
        <img src={fishy} style={{ width: 150 }} alt='fish' />
        <Link className="landing" to="/register">Register</Link>
      </div>
    </Section>
  );
}
