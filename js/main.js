const ticTacToeGame = new TicTacToeGame()

//New function to clear Tic-Tac-Toe Board without a page refresh
// Button click event listener
document.querySelector('button').addEventListener('click', ticTacToeGame.reset)

ticTacToeGame.start()

function TicTacToeGame(){
    const board = new Board()
    const humanPlayer = new HumanPlayer(board)
    const computerPlayer = new ComputerPlayer(board)
    
    //Start at turn 0
    let turn = 0

    this.start = function(){
        const config = { childList: true } // Takes notice when the child of a Section changes
        
        const observer = new MutationObserver(() => takeTurn()) // Sets to run takeTurn() when that child change occurs
        
        board.positions.forEach((el) => observer.observe(el,config)) // Observes the element based on the config variable above for each of sections of the game board (https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
        
        takeTurn() // Runs takeTurn() below
    }

    function takeTurn(){
        if(board.checkForWinner()){ // Checks for a win condition and returns boolean for every turn taken
            return
        }
        
        // A simple mathematic to stop the computer from taking turns before the player has a chance. Basically saying on an even number of turns it will always be the player's turn
        // EX. Turn 1 = Player -> Turn 2 = Computer (2 turns taken % 2 === 0 remainder, so it becomes the Player's turn again and starts over)
        // Turn 3 = Player -> Turn 4 = Computer (4 turns taken % 2 === 0 remainer and etc.
        if(turn % 2 === 0){
            humanPlayer.takeTurn()
        }else{
            computerPlayer.takeTurn()
        }
        turn++ // Add 1 to turn every time
    }

    //Reset the game without a page refresh
    //Simple forEach function to target all board positions(el) and turn them into empty strings
    //Removes any 'winner' classes from cols (golden font)
    //Set turn sequence back to 0 so it always starts at human's turn
    this.reset = function(){
        board.positions.forEach((el) => {
            el.innerText = ''
            el.classList.remove('winner')
            turn = 0
        })
    }
}

function Board(){
    this.positions = Array.from(document.querySelectorAll('.col')) // Puts everything with a .col class into an array (i.e. all inner sections become an array)
    
    // Board Position Index
    // 0 1 2
    // 3 4 5
    // 6 7 8

    this.checkForWinner = function(){
        
        // Code checks that the winner value is still false
        let winner = false
        
        const winningCombinations = [
            // Array of winning combination positions on the board
            // Index for each subarray is [0,1,2] for use below
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,4,8],
            [2,4,6],
            [0,3,6],
            [1,4,7],
            [2,5,8]
        ]

        // Need to reference the constructor's positions value under Board() above
        const positions = this.positions

        // Code is constantly evaluating the board for 3 X's or O's in a row
        // forEach method will run the code once for each element in the array
        // Declares variables for each winning combination position based on their respective indexs above ([0,1,2]) from the list of winning combinations
        winningCombinations.forEach((winningCombo) => {
            const pos0InnerText = positions[winningCombo[0]].innerText
            const pos1InnerText = positions[winningCombo[1]].innerText
            const pos2InnerText = positions[winningCombo[2]].innerText
            
            // Declares a winner under these conditions:
            const isWinningCombo = 
            
            // There are no empty strings in the 0 index, meaning you can't win without all 3 indexes ([0,1,2]) filled
            // Result is exactly the same with any of the other pos indexes
            // EX. pos0InnerText, pos1InnerText, pos2InnerText
            pos0InnerText !== '' &&
            
            // All 3 positions are strictly equal to each other
            // pos0 === pos1 === pos2 i.e. X/O === X/O === X/O
            pos0InnerText === pos1InnerText &&
            pos1InnerText === pos2InnerText
        
        // If a winning combo is present on the board:
        // Winner variable becomes true
        // Html with the .winner class is changed in the winning combos 'positions[index]' (in this case it changes the color from black to blue)
        // Returns the value back to winner variable
        if(isWinningCombo){
            winner = true
            winningCombo.forEach((index) => {
                positions[index].className += ' winner'
            })
        }
        
        })
        return winner
    }
}


function HumanPlayer(board){
    this.takeTurn = function(){
        board.positions.forEach(el => el.addEventListener('click', handleTurnTaken))
    }
    function handleTurnTaken(event){
        event.target.innerText = 'X'
        board.positions.forEach(el => el.removeEventListener('click', handleTurnTaken))
    }
}


function ComputerPlayer(board){
    this.takeTurn = function(){
        const availablePositions = board.positions.filter((p) => p.innerText === '') // Code checks to see which square has an empty string and filters them out for use
        const move = Math.floor(Math.random() * availablePositions.length) // Math.floor keeps the Math.random number from being a decimal, then multiplies it by the length of the board positions array '[move]' based on the number of spaces available
        availablePositions[move].innerText = 'O' // Code runs and puts an 'O' randomly in an available space on the board
    }
}

// // Simple function to refresh the page on button press
// document.querySelector('button').addEventListener('click', resetGame) // Button click event listener
// function resetGame(){
//     window.location.reload() //Refreshes page
// }