import React from 'react';
import { Section } from '../../components/Utils/Utils';
import { Link } from 'react-router-dom';

export default function RulesPage() {

  return (
    <Section>
      <div className="container pop rules-text">
        <h2>The rules of Go Fish:</h2>
        <p>The objective of Go Fish is to collect as many books as possible.  A book is four cards of the same rank.  The player with the most books at the end of the game is the winner.</p>
        <p>The game may be played by two, three, or four players.  When joining a room, first select your seat at the table.  Once all the desired players have joined, the host will have the option to begin the game.</p>
        <p>Each player will be dealt a hand of 7 cards, and the remainder of the deck is placed in the center.</p>
        <h2>On your turn</h2>
        <p>At the beginning of each player’s turn, they first select another player to query.  Once they’ve selected the player, they then select a rank from their hand to ask if the opponent has any matching ranked cards.  If the opposing player does, they must give them up to the asking player.  If the opposing player does not have the card asked, the asking player must “Go Fish” and draw a card from the deck in the center.  If they subsequently draw a card of the rank they asked for in that turn, they are rewarded with another turn.  Otherwise, play moves on to the next player.</p>
        <h2>Drawing new cards</h2>
        <p>If at any point you completely run out of cards in your hand, you will be dealt a new hand from the deck.  If there are no more cards in the deck, your play is over, and the remaining players with cards in their hands will finish the last few books.</p>
      </div>
    </Section>
  );
}
