import React, { Component } from 'react'

export default class AskPerson extends Component {



    //checks to see if player chose another player
    validatePlayerChoice = () => {
        //if no player is selected
        //return message
    };

    render() {
        return (
            <div>
                <form action="">
                    <label htmlFor="Player 1">
                        <span>Player 1</span>
                        <input type="radio" name="Player1" id="Player 1" value="Player 1" />
                    </label>
                    <br />
                    <label htmlFor="Player 2">
                        <span>Player 2</span>
                        <input type="radio" name="Player 2" id="Player 2" value="Player 2" />
                    </label>
                    <br />

                    <label htmlFor="Player 3">
                        <span>Player 3</span>
                        <input type="radio" name="Player3" id="Player 3" value="Player 3" />
                    </label>
                    <br />
                    <span>click on a player you want to ask!</span>
                    <br />
                    <span>You<span>[avatar]</span></span>
                    <br />
                </form>
                <a href="/ask"><button type="submit" value="confirm">confirm</button></a>

            </div>
        )
    }
}
