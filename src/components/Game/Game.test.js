import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Game from './Game';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <Game />
        </BrowserRouter>,
        div
    );
    ReactDOM.unmountComponentAtNode(div);
});
