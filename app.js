var numSquares = 6;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");
var score = 0; 
var scoreDisplay = document.querySelector("#scoreDisplay"); 
var resetPressed = true; 


init();
/* Function first initializes the Buttons and sqaures for the game.
It also checks the local storage to see if there is any previous score
and it will pass that onto the scoreDisplay if it finds one, otherwise
it sets the score at 0. */
function init(){
	setupModeButtons();
	setupSquares();
	var lsScore = localStorage.getItem('score');
	if( lsScore !== null ){
		score = lsScore; 
		scoreDisplay.textContent = score;
	}
	else {
		localStorage.setItem('score', score); 
	}
	reset();
}

/* Function sets up the number of squares based on if Hard or Easy mode
was chosen by the player. */
function setupModeButtons(){
	for(var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		});
	}
}

/* Function listens for clicks and changes squares background colors
to black if wrong square was chosen.  If player chooses the correct color
the function updates the h1 element with the correct color and updates 
the text with the color's name.  Also updates text to say "Correct" and
"Play Again?".  This function also keeps track of the player's score
and stores it in local storage.  */
function setupSquares(){
	for(var i = 0; i < squares.length; i++){
	//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.background;
			//compare color to pickedColor
			if(clickedColor === pickedColor){ 
				updateColorName();
				//console.log(colorName);
				messageDisplay.textContent = "Correct!";
				resetButton.textContent = "Play Again?"
				changeColors(clickedColor);
				h1.style.background = clickedColor;
				if(resetPressed){
					score+=5; 
					resetPressed = false;
				}
				scoreDisplay.textContent = score;
				localStorage.setItem('score', score);
			} else {
				this.style.background = "#232323";
				messageDisplay.textContent = "Try Again"
				score--;
				scoreDisplay.textContent = score; 
				localStorage.setItem('score', score);
			}
		});
	}
}

/* Function runs parallel to the function above.  It 
sends a fetch request when the correct color has been chosen
and gets the color's name and info from the url. */
async function updateColorName(){
	const regex = /\([^\)]+\)/g; 
	var rgbColors = pickedColor.match(regex); 
	const url = "https://www.thecolorapi.com/id?rgb="+rgbColors[0];
	var requestOptions = {
	  method: 'GET',
	  redirect: 'follow'
	};

	let result = await fetch(url, requestOptions); 
	let colorData = await result.json(); 

	if(colorData.name.exact_match_name) {
		colorDisplay.textContent = colorData.name.value; 
	}
	else {
		colorDisplay.textContent = colorData.name.value + "-ish"; 
	}
}

/* When player resets the game the function resets the h1 background
color to "steelblue".  It also runs through a loop and assigns a 
random color from an array to each of the squares until they all are done.  It
also resets the color name to text showing the new color's
rgb color breakdown text. */
function reset(){
	resetPressed = true;
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "";
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
}

resetButton.addEventListener("click", function(){
	reset();
})


/* This function uses a loop to change the background color of all
the squares to match the correctly chosen color.  */
function changeColors(color){
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}

/* This function creates a method for randomly generating colors that
will then be put into an array. */
function pickColor(){
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

/* This function creates an array and then gets the randomly 
generated colors and pushes them into an array. */
function generateRandomColors(num){
	//make an array
	var arr = []
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor())
	}
	//return that array
	return arr;
}

/* Function creates the RGB breakdown and assigns each part to it's own
variable and then concatenates the string "rgb" with the variables.  */
function randomColor(){
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}