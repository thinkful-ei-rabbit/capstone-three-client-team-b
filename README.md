# Go Fish Client

This app allows users to play a fun game of Go Fish.
Here's the deployed version of `Go Fish`: [Go Fish](https://capstone-3-client-deploy.vercel.app/ 'Go Fish Live Link')

<!-- https://capstone-3-client-deploy.vercel.app/  -->

### Demo Accounts:

<!-- - username: Miles Morales -->

- email address: miles@gmail.com
- password: Foobar!123

OR

<!-- - username: Frozone -->

- email address: FroZone@incredibles.com
- password: Boobaz!123

## Table of Contents

- [Demo Accounts](#Demo-Account)
- [Quick App Demo](#Quick-App-Demo)
<!-- - [A More Detailed Look](#A-More-Detailed-Look) -->
- [Storytime](#Storytime)
- [Tech Stack](#Tech-Stack)
  - [Front End](#Front-End)
  - [Testing](#Testing)
  - [Production](#Production)
- [Getting Started](#Getting-Started)
  - [Server Setup](#Server-Setup)
- [Upcoming Features](#Upcoming-Features)
- [About the Devs](#About-the-Devs)
- [Special Thanks](#Special-Thanks)

## Quick App Demo

![giphy](https://media.giphy.com/media/AUJnEt2yVTnyfViugs/giphy.gif)

<!-- ## A More Detailed Look

### These links show screenshots of the app with the components they're referencing labeled as well.

Note: component names are listed in the green boxes

- [GAME TABLE](https://imgur.com/a/I0Ag4tv)
- [CHAT](https://imgur.com/a/k8Repzt)
- [LOGIN](https://imgur.com/a/MHjs696)
- [REGISTRATION FORM](https://imgur.com/a/NoXozEx) -->

## Storytime

Go Fish is a classic children's card game where users try to win the most books (a matching set of cards). Throughout the game, users can chat with one another. Also, the chat box displays updates of what's going on in the game. For example, if player 1 asks player 3 for a card. Then the chat box will display whether or not player 3 told player 1 to go fish. The term "go fish" refers to when users have to draw a card from the deck. Currently, users can also see a card be added to other player's hands. Within the game, users are only displayed their own cards [note: other users' cards are not displayed in state, for you devs who might be wondering ;)] Overall, this was an exciting project to start, because we had no prior experience to building a gaming application, but we took on the challenge! We have a few [upcoming users stories](#Upcoming-Featuress) that we're excited to implement as well!

Fun tidbits:

- This app utilizes socket.io technology. It was our first time incorporating this tech and we're really excited to see the game in production mode!
- These playing cards were custom made!

  Here's an example of the backside:
  [Back of Playing Card](https://imgur.com/a/gct0JEY)

  Here's an example of the frontside:
  [Front of Playing Card](https://imgur.com/a/nVWjIKN)

## Tech Stack

### Front End

- React
  - Create React App
  - React Router
- Socket.io
- HTML5
- CSS3

### Testing

- Jest (Smoke tests)

### Production

- Deployed via Vercel

## Getting Started

Clone this repository to your local machine

```
git clone https://github.com/thinkful-ei-rabbit/capstone-three-client-team-b.git Go-Fish-client
```

Change directory into the cloned repository

```
cd capstone-three-client-team-b
```

Make a fresh start of the git history for this project

```
rm -rf .git && git init
```

Install the node dependencies

```
npm install
```

### Server Setup

Follow the [setup](https://github.com/thinkful-ei-rabbit/capstone-three-server-team-b) instructions to get `Go Fish Server` up and running.

## Scripts to get started

Run the tests

```
npm t
```

Start the application

```
npm start
```

## Upcoming Features

<!-- ### We're working dilligently to incorporate these next user stories! -->

- Returning users can edit their profile
- Users can view a score board

## About the Devs

-[Caleb](https://github.com/cabejackson) -[Harry](https://github.com/cabejackson) -[Jason](https://github.com/cabejackson) -[Malik](https://github.com/cabejackson) -[Michael](https://github.com/cabejackson)

## Special Thanks

To Thinkful's Engineering Immersion Course TAs, instructors and mentors!
