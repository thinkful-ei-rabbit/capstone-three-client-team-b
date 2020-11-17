import React, { Component } from 'react';
import './AskForCard.css';

export default class AskForCard extends Component {
    render() {
        return (
            <div>
                <form action="">
                    <div className="groupItems">
                        <label htmlFor="Ace">
                            <span className="cardOptions">Ace</span>
                            <input type="radio" name="Ace" id="Ace" value="Ace" />
                        </label>
                        <br />
                        <label htmlFor="6">
                            <span className="cardOptions">6</span>
                            <input type="radio" name="6" id="6" value="6" />
                        </label>
                        <br />

                        <label htmlFor="9">
                            <span className="cardOptions">9</span>
                            <input type="radio" name="9" id="9" value="9" />
                        </label>
                        <br />
                        <label htmlFor="7">
                            <span>7</span>
                            <input type="radio" name="7" id="7" value="7" />
                        </label>
                        <br />
                        <label htmlFor="Jack">
                            <span>Jack</span>
                            <input type="radio" name="Player3" id="Jack" value="Jack" />
                        </label>
                        <br />
                        <label htmlFor="3">
                            <span>3</span>
                            <input type="radio" name="3" id="3" value="3" />
                        </label>
                        <br />
                        <label htmlFor="King">
                            <span>King</span>
                            <input type="radio" name="King" id="King" value="King" />
                        </label>
                    </div>

                    <br />
                    <span>click on card you want to ask for!</span>
                    <br />
                    <span>You<span>[avatar]</span></span>
                    <br />
                </form>
                <a href="/"><button type="submit" value="confirm">confirm</button></a>

            </div>
        )
    }
}
