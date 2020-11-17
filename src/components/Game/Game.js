import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';


export default class Game extends Component {
    //instead of "player [insert #]", it would be the player's usernames
    //also [avatar] would be the img they chose
    render() {
        return (
            <div>
                <h1>welcome all fishers!</h1>
                <p>Player 1<span>[avatar]</span></p>
                <p>Player 2<span>[avatar]</span></p>
                <p>Player 3<span>[avatar]</span></p>
                <span><span>[deck img]</span><a href="/firstMove"><button>Deal Cards</button></a></span>
                <p>~ You ~<span>[avatar]</span></p>
            </div>
        )
    }
}
