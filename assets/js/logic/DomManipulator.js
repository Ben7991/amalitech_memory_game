import MultiPlayer from "./MultiPlayer.js";

class DomManipulator
{
    #theme = "numbers";
    #players = 1;
    #grid = 4;
    #game = null;
    #pairTileClicked = 0;
    #totalTileClicked = 0;
    #highestTileNumber = 8;
    currentPlayer = 1;
    #addTileMoves = [];
    #totalSinglePairCount = 0;

    constructor() {
        this.seconds = 0;
        this.timerStarted = false;
        this.timerTracker = null;
        this.timer = "";
    }

    init() {
        this.chooseTheme();
        this.selectPlayers();
        this.chooseGrid();
        this.startGame();
        this.currentlyRunningGame();
    }

    // choose theme for entire game at the moment
    chooseTheme() {
        let btnNumberTheme = document.querySelector('.btn-theme-number');
        let btnIconTheme = document.querySelector('.btn-theme-icon');

        const hidePreviouslySelectedTheme = () => {
            btnNumberTheme.classList.remove('active');
            btnIconTheme.classList.remove('active');
        }
        
        btnNumberTheme.addEventListener('click', () => {
            hidePreviouslySelectedTheme();
            this.#theme = "numbers";
        });

        btnIconTheme.addEventListener('click', () => {
            hidePreviouslySelectedTheme();
            this.#theme = "icons";
            btnIconTheme.classList.add('active');
        });
    }

    // select no. of players to play game
    selectPlayers() {
        let btnPlayers = document.querySelectorAll('.btn-players');

        const hidePreviouslySelectPlayers = () => {
            btnPlayers.forEach(btnPlayer => {
                btnPlayer.classList.remove('active');
            });
        }

        for (let i = 0; i < btnPlayers.length; i++) {
            btnPlayers[i].addEventListener('click', () => {
                hidePreviouslySelectPlayers();
                this.#players = parseInt(btnPlayers[i].textContent);
                if (i > 0)
                    btnPlayers[i].classList.add('active');
            });
        }
    }

    chooseGrid() {
        let btnGridSizeFour = document.querySelector('.btn-game-grid-4');
        let btnGridSizeSix = document.querySelector('.btn-game-grid-6');

        btnGridSizeFour.addEventListener('click', () => {
            this.#grid = 4;
            btnGridSizeSix.classList.remove('active');
            this.#highestTileNumber = 8;
        });
        
        btnGridSizeSix.addEventListener('click', () => { 
            this.#grid = 6;
            this.#highestTileNumber = 18;
            btnGridSizeSix.classList.add('active');
        });
    }

    startGame() {
        const btnStartGame = document.querySelector('.btn-start-game');

        btnStartGame.addEventListener('click', () => {
            
            if (this.#players > 1)
                this.#game = new MultiPlayer(this.#players);

            document.querySelector('.start-up').classList.add('d-none');
            document.querySelector('.game').classList.remove('d-none');

            this.#highestTileNumber = this.#grid === 4 ? 8 : 18;
            this.gameScreenFooter();
            this.createTiles();
        });
    }

    generateTileValues() {
        let values = null;

        if (this.#grid === 4)
            values = [1, 3, 5, 8, 2, 4, 6, 8, 7, 3, 4, 7, 6, 1, 2, 5];
        else if (this.#grid === 6)
            values =    [2, 5, 8, 11, 15, 18, 1, 17, 3, 4, 13, 6, 12, 9, 14, 7, 16, 10, 12, 18, 10, 3, 2, 5, 8, 14, 7, 16, 6, 11, 9, 15, 1, 17, 4, 13];
        
        return values;
    }

    createTiles() {
        let totalTiles = this.#grid === 4 ? 16 : 36;
        let tileContainer = document.querySelector('.game__btn-container');
        let generatedTileValues = this.generateTileValues();
        let tileStartPicker = Math.floor(Math.random() * totalTiles) + 1;
        let tileClassName = this.#grid === 4 ? 'btn btn--dark btn--game btn--grid-6' : 'btn btn--dark btn--game btn--grid-4';

        for (let i = 0; i < totalTiles; i++) {
            let btnTile = document.createElement('button');
            btnTile.className = tileClassName;

            if (tileStartPicker > (generatedTileValues.length - 1))
                tileStartPicker = 0;

            btnTile.accessKey = i;
            btnTile.value = generatedTileValues[tileStartPicker];
            btnTile.addEventListener('click', () => {
                if (btnTile.children.length > 0)
                    return;

                this.tileBuilder(btnTile);
            });

            tileContainer.appendChild(btnTile);
            tileStartPicker++;
        }
    }

    tileBuilder(tile) {
        this.#pairTileClicked++;

        if (this.#players === 1)
            this.startTimer();

        let tileInnerContent = this.tileContent(tile.value);
        tile.appendChild(tileInnerContent);

        if (this.#pairTileClicked == 3) {
            this.#pairTileClicked = 1;
            this.#addTileMoves = new Array();
        }

        let move = { index: tile.accessKey, value: tile.value };
        this.#addTileMoves.push(move);

        if (this.#pairTileClicked == 2) {
            if (this.#players === 1)
                this.updateSingleGameScore();

            if (this.#addTileMoves[0].value === this.#addTileMoves[1].value) {
                if (this.#players > 1) {
                    this.#game.incrementPairFound(this.currentPlayer);
                    let pairFound = this.#game.getCurrentPlayerPairFound(this.currentPlayer);
                    document.querySelectorAll('.game__player-heading')[this.currentPlayer - 1].textContent = pairFound;
                }

                this.#totalTileClicked += 2;
                document.querySelectorAll('.btn--game').forEach(btnTile => btnTile.classList.replace('btn--orange', 'btn--dark'));

                for (let i = 0; i < this.#addTileMoves.length; i++) {
                    let btnTiles = document.querySelectorAll('.btn--game');
                    btnTiles.forEach(btnTile => {
                        if (btnTile.accessKey === this.#addTileMoves[i].index)
                            btnTile.classList.replace('btn--dark', 'btn--orange');
                    });
                }
            }
            else {
                for (let i = 0; i < this.#addTileMoves.length; i++) {
                    let btnTiles = document.querySelectorAll('.btn--game');
                    btnTiles.forEach(btnTile => {
                        if (btnTile.accessKey === this.#addTileMoves[i].index) {
                            setTimeout(() => {
                                btnTile.children[0].remove();
                            }, 500);
                        }
                    });
                }

                if (this.#players > 1) {
                    this.currentPlayer++;
                    if (this.currentPlayer > this.#players)
                        this.currentPlayer = 1;
                    this.moveToNextPlayer();
                }
            }
        }

        if (this.#grid === 4 && this.#totalTileClicked === 16)
            this.showEndGameScreen();
        else if (this.#grid === 6 && this.#totalTileClicked === 36)
            this.showEndGameScreen();
    }

    updateSingleGameScore() {
        this.#totalSinglePairCount++;
        document.querySelector('#single-player-moves').textContent = this.#totalSinglePairCount.toString();
    }

    showEndGameScreen() {
        if (this.#players > 1) 
            this.showMultiPlayerEndGameScreen();
        else
            this.showSinglePlayerEndGameScreen();
    }

    showMultiPlayerEndGameScreen() {
        let endGameScreen = document.querySelector('.game-over-multiplayer');
        endGameScreen.classList.remove('d-none');

        let playerScoreBoardContainer = document.querySelector('.game-over__player');
        let scoreBoard = this.#game.scoreBoard;
        let scoreBoardUpperBound = scoreBoard.length - 1;

        let winningPlayerNumbers = this.#game.calculateTotalWinningPlayers();
        
        for (let i = 1; i <= this.#players; i++) {
            let playerSection = document.createElement('div');
            playerSection.className = 'game-over__player-section';
            if (winningPlayerNumbers === 1 && i === 1)
                playerSection.classList.add('active');
            else if (winningPlayerNumbers >= i)
                playerSection.classList.add('active');

            let gamePlayerDescription = document.createElement('p');
            gamePlayerDescription.className = 'game-over__player-description';
            gamePlayerDescription.textContent = `Player ${scoreBoard[scoreBoardUpperBound].playerNumber}`;

            let gamePlayerPairFound = document.createElement('h3');
            gamePlayerPairFound.className = 'game-over__player-info';
            gamePlayerPairFound.textContent = scoreBoard[scoreBoardUpperBound].totalPairFound;
            scoreBoardUpperBound--;

            playerSection.appendChild(gamePlayerDescription);
            playerSection.appendChild(gamePlayerPairFound);

            playerScoreBoardContainer.append(playerSection);
        }

        document.querySelector('.game-over__heading').textContent = this.#game.determineWinnerText();
    }

    showSinglePlayerEndGameScreen() {
        let endGameScreen = document.querySelector('.game-over-single');
        endGameScreen.classList.remove('d-none');
        clearInterval(this.timerTracker);
        
        document.querySelector('.game-single-timer').textContent = this.timer;
        document.querySelector('.game-single-moves').textContent = `${this.#totalSinglePairCount} Moves`;
        
        this.timerStarted = false;
        this.#totalSinglePairCount = 0;
    }

    tileContent(tileInnerContent) {
        let content = null;
        const icons = [
            'house', 'poo', 'bomb', 'hippo', 'tree', 'plane', 'umbrella', 'ghost', 'lemon', 
            'globe', 'hand', 'bicycle', 'heart', 'car', 'gift', 'pen', 'film', 'gear'
        ];

        if (this.#theme === 'numbers') {
            content = document.createElement('span');
            content.textContent = tileInnerContent;
        }
        else {
            content = document.createElement('i');
            content.className = `fa-solid fa-${icons[tileInnerContent - 1]}`;
        }

        return content;
    }

    moveToNextPlayer() {
        let gamePlayers = document.querySelectorAll('.game__player');
        gamePlayers.forEach(gamePlayer => {
            gamePlayer.classList.remove('game__player--active');
        });
        gamePlayers[this.currentPlayer - 1].classList.add('game__player--active');

        let currentTurnTexts = document.querySelectorAll('.game__player-current');
        currentTurnTexts.forEach(currentTurnText => {
            if (!currentTurnText.classList.contains('d-none'))
                currentTurnText.classList.add('d-none');
        });

        if (window.innerWidth > 1200)
            currentTurnTexts[this.currentPlayer - 1].classList.remove('d-none');
    }

    gameScreenFooter() {
        if (this.#players == 1)
            this.showSinglePlayerFooter();
        else
            this.showMultiPlayerFooter();
    }

    showSinglePlayerFooter() {
        const gameFooter = document.querySelector('.game__single-player');
        gameFooter.classList.remove('d-none');
    }

    showMultiPlayerFooter() {
        const gameFooter = document.querySelector('.game__multi-player');
        let gamePlayerColumnSize = null;
        
        if (this.#players === 2)
            gamePlayerColumnSize = 6;
        else if (this.#players === 3)
            gamePlayerColumnSize = 4;
        else if (this.#players === 4)
            gamePlayerColumnSize = 3;

        for (let i = 1; i <= this.#players; i++) {
            this.createMultiPlayerFooterSection(gameFooter, i, gamePlayerColumnSize);
        }

        gameFooter.classList.remove('d-none');
    }

    createMultiPlayerFooterSection(footerContainer, playerNumber, columnSize) {
        let gamePlayerColumn = document.createElement('div');
        gamePlayerColumn.className = `col-${columnSize} game__player-column`;
        
        let gamePlayerHolder = document.createElement('div');
        gamePlayerHolder.className = 'game__player-holder';
        
        let gamePlayerDetail = document.createElement('div');
        gamePlayerDetail.className = 'game__player';
        if (playerNumber === 1)
            gamePlayerDetail.classList.add('game__player--active');
        
        let gamePlayerDetailSubTitle = document.createElement('h5');
        gamePlayerDetailSubTitle.className = 'game__player-heading-sub';
        
        if (window.innerWidth < 500)
            gamePlayerDetailSubTitle.textContent = `P${playerNumber}`;
        else
            gamePlayerDetailSubTitle.textContent = `Player ${playerNumber}`;

        let gamePlayerDetailTitle = document.createElement('h3');
        gamePlayerDetailTitle.className = 'game__player-heading';
        gamePlayerDetailTitle.textContent = 0;

        let currentPlayerTurn = document.createElement('p');
        currentPlayerTurn.className = 'game__player-current';
        currentPlayerTurn.textContent = 'Current Player';

        if (window.innerWidth < 1200 || playerNumber > 1)
            currentPlayerTurn.classList.add('d-none');


        gamePlayerDetail.appendChild(gamePlayerDetailSubTitle);
        gamePlayerDetail.appendChild(gamePlayerDetailTitle);

        gamePlayerHolder.appendChild(gamePlayerDetail);
        gamePlayerHolder.appendChild(currentPlayerTurn);

        gamePlayerColumn.appendChild(gamePlayerHolder);
        footerContainer.appendChild(gamePlayerColumn);
    }

    startTimer() {
        if (this.timerStarted)
            return;

        this.timerStarted = true;
        this.timerTracker = setInterval(() => {
            let minutes = Math.floor((this.seconds % 3600) / 60);
            let sec = this.seconds % 60;
            this.timer = `${minutes}:${sec}`;
            document.querySelector('#single-player-time').textContent = this.timer;
            this.seconds++;
        }, 1000);
    }

    currentlyRunningGame() {
        let btnMobileMenu = document.querySelector('.btn--mobile');
        let modalMobileGameMenu = document.querySelector('.game-menu');

        btnMobileMenu.addEventListener('click', () => {
            modalMobileGameMenu.classList.remove('d-none');
        });

        let btnMobileResumeGame = document.querySelector('.resume-game');
        btnMobileResumeGame.addEventListener('click', () => {
            modalMobileGameMenu.classList.add('d-none');
        });
        this.restartGame();
        this.newGame();
    }

    restartGame() {
        const btnRestartGames = document.querySelectorAll('.restart-game');
        
        for (let i = 0; i < btnRestartGames.length; i++) {
            btnRestartGames[i].addEventListener('click', () => {
                document.querySelectorAll('.btn--game').forEach(btnTile => btnTile.remove());

                this.#totalTileClicked = 0;
                if (this.#players > 1) 
                    this.restartMultiPlayerGame();
                else 
                    this.restartSinglePlayerGame();

                this.createTiles();
            });
        }
    }

    resetSinglePlayer() {
        clearInterval(this.timerTracker);
        this.seconds = this.#totalSinglePairCount = 0;
        this.timerStarted = false;
    }

    // reset single player game screen settings
    restartSinglePlayerGame() {
        this.resetSinglePlayer();

        document.querySelector('#single-player-time').textContent = "0";
        document.querySelector('#single-player-moves').textContent = "0";

        const gameOverModal = document.querySelector('.game-over-single');
        if (!gameOverModal.classList.contains('d-none'))
            gameOverModal.classList.add('d-none');
    }

    // reset multiplayer game screen settings
    restartMultiPlayerGame() {
        this.#game.resetPlayers();
        const gameOverModal = document.querySelector('.game-over-multiplayer');
        if (!gameOverModal.classList.contains('d-none'))
            gameOverModal.classList.add('d-none');

        document.querySelectorAll('.game__player-heading').forEach(playerCounter => {
            playerCounter.textContent = "0";
        });
        
        document.querySelectorAll('.game-over__player-section').forEach(playerSection => {
            playerSection.remove();
        });

        this.currentPlayer = 1;
        this.moveToNextPlayer();
    }

    newGame() {
        const btnNewGames = document.querySelectorAll('.btn-new-game');
        
        for (let i = 0; i < btnNewGames.length; i++) {
            btnNewGames[i].addEventListener('click', () => {
                this.resetPreviousStartGameScreen();
                document.querySelector('.start-up').classList.remove('d-none');
                document.querySelector('.game').classList.add('d-none');
                document.querySelectorAll('.btn--game').forEach(btnTile => btnTile.remove());

                let btnTiles = document.querySelectorAll('.btn--game');
                btnTiles.forEach(btnTile => btnTile.remove());

                this.#totalTileClicked = 0;
                if (this.#players > 1)
                    this.resetMultiPlayerGameScreen();
                else
                    this.resetSinglePlayerGameScreen();

                this.#theme = "numbers";
                this.#players = 1;
                this.#grid = 4;
            });
        }
    }

    resetSinglePlayerGameScreen() {
        const gameOverModal = document.querySelector('.game-over-single');
        if (!gameOverModal.classList.contains('d-none'))
            gameOverModal.classList.add('d-none');

        const gameScreenFooter = document.querySelector('.game__single-player');
        if (!gameScreenFooter.classList.contains('d-none'))
            gameScreenFooter.classList.add('d-none');

        const gameMenu = document.querySelector('.game-menu');
        if (!gameMenu.classList.contains('d-none'))
            gameMenu.classList.add('d-none');

        document.querySelector('#single-player-time').textContent = "0";
        document.querySelector('#single-player-moves').textContent = "0";

        this.resetSinglePlayer();
    }

    resetMultiPlayerGameScreen() {
        this.#game.resetPlayers();

        const gameOverModal = document.querySelector('.game-over-multiplayer');
        if (!gameOverModal.classList.contains('d-none'))
            gameOverModal.classList.add('d-none');

        document.querySelectorAll('.game__player-column').forEach(gamePlayerColumn => {
            gamePlayerColumn.remove();
        });

        document.querySelectorAll('.game-over__player-section').forEach(playerSection => {
            playerSection.remove();
        });
    }

    resetPreviousStartGameScreen() {
        document.querySelector('.btn-theme-icon').classList.remove('active');

        document.querySelectorAll('.btn-players').forEach(btnPlayer => {
            btnPlayer.classList.remove('active');
        });

        document.querySelector('.btn-game-grid-6').classList.remove('active');
    }
}

export default DomManipulator;