## The challenge

Your challenge is to build out this Memory game and get it looking as close to the design as possible.

Your users should be able to:

- View the optimal layout for the game depending on their device's screen size
- See hover states for all interactive elements on the page
- Play the Memory game either solo or multiplayer (up to 4 players)
- Set the theme to use numbers or icons within the tiles
- Choose to play on either a 6x6 or 4x4 grid


### Expected behaviour

- You can choose to make the default screen either the Start Game screen or the solo player 4x4 grid. Note that we're using the solo player 4x4 grid for the design screenshot, so if you choose the Start Game screen, it won't match up in the design comparison slider. This isn't a big deal, but is something worth considering.
- In a solo game, track the time elapsed since first clicking on a tile and the total number of moves made. A move counts as two tiles being selected as a potential match. Once all pairs have been found, stop the timer and show the end of game modal with the stats.
- In a multiplayer game, track the total number of pairs each player has found. If a player finds a pair, increment their score by one. The current turn switches to the next player after the current player has made a move to find a potential match.
- Clicking "Restart" will restart the game with the current settings
- Clicking "New Game" will go to the Start Game screen where the player can choose their settings
- The icons in the design are from [Font Awesome](https://fontawesome.com/). Please choose whatever icons you prefer. You could even use a different icon library, if you like.

