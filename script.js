// Right here I am instructing the app to wait until the DOM is fully loaded before starting the game
document.addEventListener("DOMContentLoaded", () => {
    quayaCrushGame();
});

function quayaCrushGame() {
    // Right here I am getting the grid element and score display
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 8; // This represents the width of the grid (8 squares across)
    const squares = []; // This represents the array to store each square
    let score = 0; // Initial score - * whenever I put initial score it represents the first scan of the board to clear any automatic matches that happen when the app randomly sets up the game.

    // Array of game piece images
    const gamePics = [
        "https://cdn.freebiesupply.com/images/large/2x/golden-state-warriors-logo-transparent.png",
        "https://files.softicons.com/download/computer-icons/xbox-360-icons-by-abhi-aravind/png/256x256/Red%20Controller.png",
        "https://i.ibb.co/Rkg5Ygh2/Banner-Img1.png",
        "https://www.pngmart.com/files/11/Basketball-Player-Kobe-Bryant-Background-PNG.png",
        "https://i.ibb.co/yBFTMhdJ/bmww.png",
        "https://imgproxy.attic.sh/insecure/f:webp/q:90/w:256/plain/https://imgproxy.attic.sh/3BxHXyk4DWTvT9-p4x7O_Hx7AprMbzNUqKhFoJNxCmg/rs:fit:768:768:1:1/t:1:FF00FF:false:false/aHR0cHM6Ly9hdHRp/Yy5zaC9rdzA1N3M4/MHFyaXk3OTkwc3F6/emZlYjNqdmFq",
    ];

    // Right here I am creating the game board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true); // Right here I am instructing the game to allow squares to be dragged
            square.setAttribute("id", i); // Right here I am seting an id for tracking
            let randomColor = Math.floor(Math.random() * gamePics.length); // Right here I am picking a random image
            square.style.backgroundImage = `url(${gamePics[randomColor]})`;
            grid.appendChild(square);
            squares.push(square); // Right here I am adding a square to squares array
        }
    }
    createBoard();

    // Right here I am creating variables to track dragging
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

     // Right here I am creating a add drag event listeners to each square
    squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) =>
        square.addEventListener("drageleave", dragLeave)
    );
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    // This function monitors when a drag starts, and remembers the color and id
    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    // Right here I am allowing dropping by preventing default
    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

     // Right here I am monitoring when a draggable element leaves a valid drop target
    function dragLeave() {
        this.style.backgroundImage = "";
    }

    // Right here I am monitoring when a square is dropped onto another square
    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    // Right here I am instructing the gme to check after dropping, to see if the move was valid
    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1, // left position
            squareIdBeingDragged - width, // above position
            squareIdBeingDragged + 1, // right position
            squareIdBeingDragged + width // below position
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null; // checking to see if the move was valid
        } else if (squareIdBeingReplaced && !validMove) {
             // If the move was invalid, then the game will undo the swap
            squares[
                squareIdBeingReplaced
            ].style.backgroundImage = colorBeingReplaced;
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
        } else
        // If the move was invalid the gamw resets
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
    }

    // Right here the function moves pieces down if there is empty space below
    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i++) { // Up to the second-to-last row
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage =
                    squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);

                //  Right here I am instructing the game to generate a new random image if first row square becomes empty,
                if (isFirstRow && squares[i].style.backgroundImage === "") {
                    let randomColor = Math.floor(
                        Math.random() * gamePics.length
                    );
                    squares[i].style.backgroundImage = gamePics[randomColor];
                }
            }
        }
    }

     // Right here I am checking for 4 matching squares in a row
    function checkRowForFour() {
        for (i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            // Right here I am skipping over invalid wrap-around indexes
            const notValid = [
                5,
                6,
                7,
                13,
                14,
                15,
                21,
                22,
                23,
                29,
                30,
                31,
                37,
                38,
                39,
                45,
                46,
                47,
                53,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            // Right here I am clearing the sqaures if all 4 squares match and not blank
                rowOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkRowForFour(); // Initial check

    // Right here I am checking for 4 matching squares in a column
    function checkColumnForFour() {
        for (i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 4;
                scoreDisplay.innerHTML = score;
                columnOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkColumnForFour(); // Initial check

    // Right here I am checking for 3 matching squares in a row
    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                6,
                7,
                14,
                15,
                22,
                23,
                30,
                31,
                38,
                39,
                46,
                47,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) 
            {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkRowForThree(); // Initial check 

    // Right here I am checking for 3 matching squares in a column
    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkColumnForThree(); 

    // Right here I am continuously checking for matches and move pieces down every 100ms
    window.setInterval(function () {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 100);
}

