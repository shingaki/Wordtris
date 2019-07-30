import React, { Component } from "react";
import "./style.css";
import Next from "../Next";
import GameArea from "../GameArea";
import Scores from "../Scores";
import Controls from "../Controls";
import API from "../../utils/API";

const nextList = [];

class Play extends Component {

    state = {
        score: 0,
        level: 1,
        fallSpeed: 250,
        currentPieceX: 100,
        currentColumn: 4,
        numLettersPerColumn: [0,0,0,0,0,0,0,0,0,0],
        currentPieceY: 0,
        pieceSpeed: 0,
        currentPieceID: 0,
        nextUp: [],
        playLetters: [],
        placedLetters: [],
        newPlacedLetters: [],
        possibleWords: [],
        word: ""
    }

    inputChange = event => {
        this.setState({
            error: ""
        })
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    // weights = [10, 8, 8, 9, 10, 7, 9, 7, 10, 8, 5, 10, 8, 10, 10, 8, 1, 10, 10, 10, 10, 7, 7, 3, 7, 1]
    weights = [67, 12, 28, 32, 104, 20, 16, 42, 63, 1, 5, 34, 21, 60, 64, 18, 1, 52, 54, 77, 23, 9, 14, 2, 14, 1]

    letterPoints = {
        A: 1,
        B: 3,
        C: 3,
        D: 2,
        E: 1,
        F: 4,
        G: 2,
        H: 4,
        I: 1,
        J: 8,
        K: 5,
        L: 1,
        M: 3,
        N: 1,
        O: 1,
        P: 3,
        Q: 10,
        R: 1,
        S: 1,
        T: 1,
        U: 1,
        V: 4,
        W: 4,
        X: 8,
        Y: 4,
        Z: 10
    }

    makeWeightedArray = (array, weights) => {
        let weightedArray = [];
        // Loop over weights
        for (let i = 0; i < weights.length; i++) {
            // let multiples = weights[i] * 100;
            let multiples = weights[i];

            // Loop over the array of letters - adding each letter in x times for its weight
            for (let j = 0; j < multiples; j++) {
                weightedArray.push(array[i]);
            }
        }
        return weightedArray;
    }

    // make array where each letter is weighted
    weightedLetters = this.makeWeightedArray(this.letters, this.weights);

    initialSetup = () => {
        var nextList = [];
        var playNow = [];
        console.log(this.weightedLetters);
        // generate next up three letters
        for (var i = 0; i < 3; i++) {
            // let random = Math.floor(Math.random() * this.letters.length);
            let random = Math.floor(Math.random() * this.weightedLetters.length);
            let randomLetter = this.weightedLetters[random];
            // save each letter and its score
            nextList.push({
                letter: randomLetter,
                points: this.letterPoints[randomLetter]
            })
        }

        // generate play now three letters
        for (var i = 0; i < 3; i++) {
            let random = Math.floor(Math.random() * 26);
            let randomLetter = this.letters[random];
            // save each letter and its score
            playNow.push({
                letter: randomLetter,
                points: this.letterPoints[randomLetter]
            })
        }
        // console.log(nextList);
        // move next up letters to play letters
        // save new next up letters
        this.setState({
            playLetters: playNow,
            nextUp: nextList
        })

        let playLetters = this.state.playLetters
        // console.log(playLetters[0])

        var emptyBoard = []
        for (var i = 0; i < 200; i++) {
            emptyBoard.push({
                letter: "",
                points: this.letterPoints[""]
            })
        }
        
        this.setState({placedLetters : emptyBoard})
    }

    pickNewLetters = () => {
        var nextList = [];
        // generate three letters
        for (var i = 0; i < 3; i++) {
            var random = Math.floor(Math.random() * 26);
            var randomLetter = this.letters[random];
            // save each letter and its score
            nextList.push({
                letter: randomLetter,
                points: this.letterPoints[randomLetter]
            })
        }
        // console.log(nextList);
        // move next up letters to play letters
        // save new next up letters
        this.setState({
            playLetters: this.state.nextUp,
            nextUp: nextList
        })
    }

    placeLetters = () => {
        var myBoard = [];
        var colmuns = [];
        var myPlacedLetters = [];

        for (let x = 0; x<10; x++) {
            colmuns[x] = this.state.numLettersPerColumn[x]
        }

        for (let x = 0; x<200; x++) {
            myBoard[x] = this.state.placedLetters[x]
        }
        
        var myColumnHeight = this.state.numLettersPerColumn[this.state.currentColumn]
        var topLetterSpot = (17 - myColumnHeight)*10 + this.state.currentColumn
        var midLetterSpot = topLetterSpot + 10
        var botLetterSpot = midLetterSpot + 10
        
        myBoard[topLetterSpot] = this.state.playLetters[0]
        myBoard[midLetterSpot] = this.state.playLetters[1]
        myBoard[botLetterSpot] = this.state.playLetters[2]

        myPlacedLetters = [topLetterSpot, midLetterSpot, botLetterSpot]
        colmuns[this.state.currentColumn] = colmuns[this.state.currentColumn] + 3

        this.setState({ newPlacedLetters : myPlacedLetters})
        this.setState({ numLettersPerColumn : colmuns})
        this.setState({ placedLetters : myBoard })
        // console.log(JSON.stringify(this.state.newPlacedLetters))
        // console.log("my board = " + JSON.stringify(this.state.placedLetters))
    }

    componentDidMount = () => {
        // initial setup
        this.initialSetup();
    }


    startClick = () => {
        this.timerID = setInterval(
            () => this.tick(),
            this.state.fallSpeed
        );
    }

    stopClick = () => {
        clearInterval(this.timerID);
    }

    increaseClick = () => {
        this.setState({ fallSpeed: this.state.fallSpeed / 2 })
        clearInterval(this.timerID);
        this.timerID = setInterval(
            () => this.tick(),
            this.state.fallSpeed
        );
    }

    downClick = () => {
        if (this.state.currentPieceY < 425 - 25 * this.state.numLettersPerColumn[this.state.currentColumn]) {
            this.setState({ currentPieceY: this.state.currentPieceY + 25 })
        }
    }

    leftClick = () => {
        if (this.state.currentPieceX > 0 && this.state.currentPieceY < 430 - 25 * this.state.numLettersPerColumn[this.state.currentColumn - 1]) {
            this.setState({ currentPieceX: this.state.currentPieceX - 25 })
            this.setState({ currentColumn: this.state.currentColumn - 1 })
        }
    }

    rightClick = () => {
        if (this.state.currentPieceX < 225 && this.state.currentPieceY < 430 - 25 * this.state.numLettersPerColumn[this.state.currentColumn + 1]) {
            this.setState({ currentPieceX: this.state.currentPieceX + 25 })
            this.setState({ currentColumn: this.state.currentColumn + 1 })
        }
    }

    cycleClick = () => {
        var cycleLetters = [];
        cycleLetters[0] = this.state.playLetters[2]
        cycleLetters[1] = this.state.playLetters[0]
        cycleLetters[2] = this.state.playLetters[1]
        // console.log(cycleLetters);
        this.setState({
            playLetters: cycleLetters
        })
    }

    tick() {
        if (this.state.currentPieceY < 425 - 25 * this.state.numLettersPerColumn[this.state.currentColumn]){
            this.setState({ pieceSpeed: 750})
            this.setState({ currentPieceY: this.state.currentPieceY + 5 })
        } else {
            this.endOfRound()
        }
    }

    updatePlacedLetters = () => {
        var myBoard = [];
        for (let x = 0; x<200; x++) {
            myBoard[x] = this.state.placedLetters[x]
        }
        myBoard[0] = this.state.playLetters[0]
        myBoard[1] = this.state.playLetters[1]
        myBoard[2] = this.state.playLetters[2]
        // console.log("my board = " + JSON.stringify(this.state.placedLetters))
        this.setState({ placedLetters : myBoard })
    }

    wordValue = (myWord) => {
        let myValue = 0;
        for (let x = 0; x < myWord.length; x++) {
            myValue = myValue + this.letterPoints[myWord[x]]
        }
        return myValue
    }

    buildHorizontalWordFromBoard = (start, stop) => {
        let myWord = ""

        if ((this.state.placedLetters[start].letter !== "") && this.state.placedLetters[stop].letter !== "") {
            // console.log(start, stop)
            for (let x = start; x <= stop; x++) {
                if (this.state.placedLetters[x].letter == "") {
                    return ""
                } else {
                    myWord = myWord + this.state.placedLetters[x].letter
                }
                
            }
            // console.log(myWord)
            return myWord;
        }
        return myWord
    }

    buildVerticalWordFromBoard = (start, stop) => {
        let myWord = ""

            for (let x = start; x <= stop; x=x+10) {
                myWord = myWord + this.state.placedLetters[x].letter
            }
            // console.log(myWord)
            return myWord;

    }

    buildPossibleWordsArray = () => {
        var myPossibleWords = [];
        var currentWord = "";
        
        for (let x = 0; x < 3; x++) {
            //adds all horizontal words to myPossibleWords
            let currentLetter = this.state.newPlacedLetters[x];
            let minLetter = currentLetter - (currentLetter % 10);
            let maxLetter = minLetter + 10;
            for (let firstLetter = minLetter; firstLetter <= currentLetter; firstLetter++) {
                for (let lastLetter = currentLetter; lastLetter < maxLetter; lastLetter++) {
                    if (!(firstLetter < currentLetter && lastLetter < currentLetter) && !(firstLetter > currentLetter && lastLetter > currentLetter) && !(firstLetter === lastLetter)) {
                        currentWord = this.buildHorizontalWordFromBoard(firstLetter, lastLetter);
                        if (currentWord !== "" && (lastLetter-firstLetter >=2)) { //2 insures that word is 3 letters or more
                            myPossibleWords.push({
                                value: this.wordValue(currentWord.trim()),
                                word: currentWord,
                                start: firstLetter,
                                end: lastLetter,
                                type: "horizontal"
                            })
                        }
                    }
                }
            }
            
            //adds all vertical words to myPossibleWords
            minLetter = currentLetter
            maxLetter = 190 + this.state.currentColumn;
            for (let firstLetter = minLetter; firstLetter <= currentLetter; firstLetter=firstLetter+10) {
                for (let lastLetter = currentLetter; lastLetter <= maxLetter; lastLetter=lastLetter+10) {
                    if (!(firstLetter < currentLetter && lastLetter < currentLetter) && !(firstLetter > currentLetter && lastLetter > currentLetter) && !(firstLetter === lastLetter)) {
                        currentWord = this.buildVerticalWordFromBoard(firstLetter, lastLetter);
                        if (currentWord !== "" && (lastLetter-firstLetter >=20)) { //20 insures that word is 3 letters or more
                            myPossibleWords.push({
                                value: this.wordValue(currentWord.trim()),
                                word: currentWord,
                                start: firstLetter,
                                end: lastLetter,
                                type: "vertical"
                            })
                        }
                    }
                }
            }
        }

        //need to sort myPossibleWords
        myPossibleWords.sort((a, b) => (a.value < b.value) ? 1 : -1)
        this.setState({ possibleWords : myPossibleWords })
        console.log(this.state.possibleWords)
        
    }

    checkWordArray = () => {
        for (let x = 0; x < this.state.possibleWords.length; x++) {
            console.log("ii " +  this.state.possibleWords[x].word);
            let isWord = this.checkIfItIsAWord(this.state.possibleWords[x].word);
            // console.log("isWord " + isWord);
            if (isWord) {
                // return x;
                console.log("x is " + x);
                } }
            return false
    }

    endOfRound = () => {
        
        // save dropping piece at its ending position as new pieces
        this.placeLetters();
        //build array of possible words should be ordered in decreasing point value
        this.buildPossibleWordsArray();
        //go through array of posisble words to check if there is a word
        let wordIndex = this.checkWordArray();
        console.log("wordIndex " + wordIndex);
        //give points for word
        //remove letters used from board and update column heights
        
        if (this.state.numLettersPerColumn[this.state.currentColumn] < 21) {
            // pick new "next up" letters, move next up to play now
            this.pickNewLetters();
            // move dropping piece back to top
            this.setState({ pieceSpeed: 0})
            this.setState({ currentPieceX: 100 })
            this.setState({ currentColumn: 4 }) 
            this.setState({ currentPieceY: 0 })  
            this.setState({ pieceSpeed: 750})
        } else {
            //Game over
            //Modal?? - with option to play again??
            //check to see if there is a new highscore
            //check to see if there is a new high word
            
            clearInterval(this.timerID);
        }

    }

    checkIfItIsAWord = (word) => {
        // event.preventDefault();
        // const word = this.state.word;
        console.log("what is the word " + word);

        API.checkWord(word).then(wordData => {
            // if login data is correct
            // console.log(this.props);
            console.log("what is this " + wordData.data);
            return wordData.data;
        })
    }

  
    
    render() {
        return (
            <div className="container">

                <h1 className="text-center mt-5">Play</h1>

                <div className="row">
                    <div className="col-md-2 text-center">
                        <Next pickNewLetters={this.pickNewLetters} nextUp={this.state.nextUp} />
                    </div>
                    <div className="col-md-7 text-center">
                        <GameArea 
                            currentPieceX={this.state.currentPieceX}
                            currentPieceY={this.state.currentPieceY} 
                            pieceSpeed = {this.state.pieceSpeed}
                            currentPieceID={this.state.currentPieceID}
                            pickNewLetters={this.pickNewLetters}          
                            endOfRound={this.endOfRound}
                            playLetters={this.state.playLetters}    
                            placedLetters={this.state.placedLetters}       
                        />
                        
                    </div>
                    <div className="col-md-3">
                        <Scores score={this.state.score} level={this.state.level} />

                        <Controls 
                            startClick={this.startClick} 
                            stopClick={this.stopClick} 
                            increaseClick={this.increaseClick} 
                            downClick={this.downClick} 
                            leftClick={this.leftClick} 
                            cycleClick={this.cycleClick} 
                            rightClick={this.rightClick} 
                        />
                    </div>
                </div>
                {/* <div>Next up: {this.state.nextUp[0]}, {this.state.nextUp[1]}, {this.state.nextUp[2]}</div> */}
                {/* <div>Playing now: {this.state.playLetters[0].letter}, {this.state.playLetters[1].letter}, {this.state.playLetters[2].letter}</div> */}
                <button onClick={this.pickNewLetters}>NEW LETTERS</button>

                {/*The below is only used to test the Trie logic*/}
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <form className="mt-3">
                            <div>
                                <div className="form-group">
                                    <label htmlFor="word" id="wordText">Enter Word</label>
                                    <input type="text" className="form-control" id="word" name="word"
                                           placeholder="Enter A Word" onChange={this.inputChange}/>
                                </div>

                                <div className="text-center">
                                    <button type="submit" id="checkword" className="btn btn-primary"
                                            onClick={this.checkIfItIsAWord}>Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                

            </div>
    
        );
    }
}

export default Play;
