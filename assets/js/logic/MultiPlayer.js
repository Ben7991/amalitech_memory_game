class MultiPlayer
{
    constructor(totalPlayers) {
        this.players = [];
        this.winnerText = "";
        this.createPlayersDetails(totalPlayers);
    }

    createPlayersDetails(totalPlayers) {
        let playerDetail = null;

        for (let i = 1; i <= totalPlayers; i++) {
            playerDetail = {
                playerNumber: i,
                totalPairFound: 0,
            };

            this.players.push(playerDetail);
        }
    }

    incrementPairFound(currentPlayer) {
        this.players.forEach(player => {
            if (player.playerNumber === currentPlayer)
                player.totalPairFound++;
        });
    }

    getCurrentPlayerPairFound(currentPlayer) {
        let playerIndex = this.players.findIndex(player => player.playerNumber === currentPlayer);
        return this.players[playerIndex].totalPairFound;
    }

    resetPlayers() {
        for (let player of this.players)
            player.totalPairFound = 0;
    }

    #calculateMaxPairFound() {
        let firstPlayerScore = 0, secondPlayerScore = 0, thirdPlayerScore = 0, fourthPlayerScore = 0;

        if (this.players.length === 4) {
            firstPlayerScore = this.players[0].totalPairFound;
            secondPlayerScore = this.players[1].totalPairFound;
            thirdPlayerScore = this.players[2].totalPairFound;
            fourthPlayerScore = this.players[3].totalPairFound;
        }
        else if (this.players.length === 3) {
            firstPlayerScore = this.players[0].totalPairFound;
            secondPlayerScore = this.players[1].totalPairFound;
            thirdPlayerScore = this.players[2].totalPairFound;
        }
        else if (this.players.length === 2) {
            firstPlayerScore = this.players[0].totalPairFound;
            secondPlayerScore = this.players[1].totalPairFound;
        }
        
        return Math.max(firstPlayerScore, secondPlayerScore, thirdPlayerScore, fourthPlayerScore);
    }

    calculateTotalWinningPlayers() {
        const maxNumber = this.#calculateMaxPairFound();
        let playersHavingMaxPair = 0;
        if (maxNumber > 0) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].totalPairFound === maxNumber)
                    playersHavingMaxPair++;
            }
        }
        return playersHavingMaxPair;
    }

    get scoreBoard() {
        const sortedPlayers = [...this.players];
        sortedPlayers.sort((a, b) => {
            return a.totalPairFound - b.totalPairFound;
        });
        return sortedPlayers;
    }

    determineWinnerText() {
        const totalWinningPlayers = this.calculateTotalWinningPlayers();
        const maxNumber = this.#calculateMaxPairFound();
        let headingText = "";

        if (totalWinningPlayers > 1 || totalWinningPlayers === 0)
            headingText = "It's a tie";
        else {
            let highestPairIndex = this.players.findIndex(player => player.totalPairFound === maxNumber);
            headingText = `Player ${this.players[highestPairIndex].playerNumber} Wins!`;
        }
        
        return headingText;
    }
}

export default MultiPlayer;