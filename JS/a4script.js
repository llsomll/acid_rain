// copyright: Dasom Kim 000926499 March 2024 
// Javascript file for Assignment 4 (Acide Rain Game)


// Constants for SVG namespace and board size
const svgNS = "http://www.w3.org/2000/svg";
const boardsizeX = 400;
const boardsizeY = 400;

// Variables for multiplication numbers, drop speed, y position, and game elements
let numA = 0;
let numB = 0;
let yspeed = 0.2;
let scoreCounter;
let hearts;
let sun = 1;
let y = -10;

// SVG element and drop container
let svg = document.getElementById("skyDrawing");
let drops = null;

// Array to store active drops
let activeDrops = [];

// Audio element for background music
let audio = document.getElementById("backgroundMusic");

// SVG content for night background
let night = `
<defs>
    <!-- Gradient for the sky -->
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#0e0014;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#361271;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#a849c8;stop-opacity:1" />
    </linearGradient>
    <!-- Gradient for the moon -->
    <linearGradient id="moonGradient" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" style="stop-color:#fff9c3;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#ffed4b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffc20b;stop-opacity:1" />
    </linearGradient>
    <!-- Gradient for the mountain -->
    <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" style="stop-color:#959177;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#3a371f;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </linearGradient>
</defs>
<rect x="0" y="0" width="400" height="400" fill="url(#skyGradient)"/>

<!-- Stars -->
<circle cx="200" cy="30" r="1" fill="#FFF"/>
<circle cx="100" cy="150" r="1" fill="#FFF"/>
<circle cx="150" cy="250" r="1" fill="#FFF"/>
<circle cx="200" cy="100" r="1" fill="#FFF"/>
<circle cx="300" cy="100" r="1" fill="#FFF"/>
<circle cx="300" cy="200" r="1" fill="#FFF"/>
<circle cx="350" cy="50" r="1" fill="#FFF"/>
<circle cx="50" cy="300" r="1" fill="#FFF"/>
<circle cx="150" cy="370" r="1" fill="#FFF"/>
<circle cx="250" cy="250" r="1" fill="#FFF"/>
<circle cx="350" cy="350" r="1" fill="#FFF"/>
<circle cx="50" cy="50" r="1" fill="#FFF"/>
<circle cx="30" cy="120" r="1" fill="#FFF"/>

<!-- Moon -->
<circle cx="200" cy="100" r="28" fill="url(#moonGradient)"/>

<!-- Mountain -->
<polygon points="30,400 100,350 150,380 250,310 350,365 400,290 400,400 " fill="url(#mountainGradient)"/>
`;






/**
 * Generates a random multiplication problem drop with a random position, font size, and multiplication text content.
 * 
 * @returns {SVGTextElement} The created SVG text element representing the multiplication problem drop.
 */
function makeRandomDrop() {

    let numDrop = document.createElementNS(svgNS, "text");

    // Set drop color based on day or night
    if (sun == 1) {
        numDrop.setAttribute("fill", "white");
    } else { numDrop.setAttribute("fill", "black"); }

    //Random Position
    numDrop.setAttribute("x", Math.random() * (boardsizeX - 60) + 5);
    numDrop.setAttribute("y", y);

    //Random Font Size
    let fontSize = Math.floor(Math.random() * 18) + 10;
    numDrop.setAttribute("font-size", fontSize);

    // Set multiplication problem text content
    numA = Math.floor(Math.random() * 9) + 1;
    numB = Math.floor(Math.random() * 9) + 1;
    numDrop.textContent = `${numA} x ${numB}`;

    return numDrop;
}




/**
 * Clears all game elements and resets variables to their initial state.
 * 
 */
function clearAll() {
    clearInterval(drops);
    let dropsToRemove = svg.querySelectorAll("text");
    dropsToRemove.forEach(drop => svg.removeChild(drop));
    scoreCounter = 0;
    hearts = 5;
    yspeed = 0.2;
    audio.pause();
}





/**
 * Removes a drop from the active drops array.
 * 
 * @param {SVGTextElement} drop - The drop element to be removed.
 * 
 */
function removeDropFromActiveDrops(drop) {
    let index = activeDrops.indexOf(drop);
    if (index !== -1) {
        activeDrops.splice(index, 1);
    }
}






/**
 * Eventlistener to start the game.
 * Starts the game when the start button is clicked, creating drops at intervals and handling game logic.
 * 
 */
startButton.addEventListener('click', function () {

    // Set focus to answer input and clear its value
    document.getElementById("answerInput").focus();
    document.getElementById("answerInput").value = "";
    // Get SVG element
    svg = document.getElementById("skyDrawing");
    // Clear all game elements
    clearAll();
    // Play background music
    audio.play();
    // Remove background change event listener
    svg.removeEventListener("click", changeBackground);
    // Clear interval if drops exist
    if (drops != null) clearInterval(drops);
    // Initialize score and hearts
    scoreCounter = 0;
    hearts = 5;
    // Create drops at intervals
    drops = setInterval(function () {
        let drop = makeRandomDrop();
        drop.setAttribute("y", y);
        svg.appendChild(drop);
        animateDrop(drop);
        activeDrops.push(drop);
    }, 1600);

    // Update hearts and score display
    updateHeartsDisplay();
    updateScoreDisplay();

    // Function to animate drop movement
    function animateDrop(drop) {
        let newY = y;
        function moveDrop() {
            if (newY < boardsizeY) {
                newY += yspeed;
                drop.setAttribute("y", newY);
                requestAnimationFrame(moveDrop);
            } else {
                // Remove drop if it reaches bottom
                if (svg.contains(drop)) {
                    svg.removeChild(drop);
                    removeDropFromActiveDrops(drop);
                    if (hearts > 0) { hearts--; }
                    else {
                        // End game if no hearts left
                        clearAll();
                        let msg = document.createElementNS(svgNS, "text");
                        msg.setAttribute("x", 200);
                        msg.setAttribute("y", 200);
                        if (sun == 1) {
                            msg.setAttribute("stroke", "white");
                            msg.setAttribute("fill", "none");
                        } else {
                            msg.setAttribute("stroke", "black");
                            msg.setAttribute("fill", "none");
                        }
                        msg.setAttribute("text-anchor", "middle");
                        msg.setAttribute("font-size", 40);
                        msg.textContent = 'GAME OVER!';
                        svg.appendChild(msg);
                    }
                }
            }
        }
        requestAnimationFrame(moveDrop);
        updateHeartsDisplay();
        updateScoreDisplay();
    }
});






/**
 * Handles the keydown event for the answer input, checking the answer when Enter is pressed.
 * 
 * @param {KeyboardEvent} event - The keydown event object.
 * 
 */
document.getElementById("answerInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let dropToCheck = null;
        // Get active drop
        if (activeDrops.length > 0) {
            for (let i = 0; i < activeDrops.length; i++) {
                if (activeDrops[i] !== null) {
                    dropToCheck = activeDrops[i];
                    break;
                }
            }
            if (dropToCheck !== null) {
                checkAnswer(dropToCheck);
            }
        }
    }
});





/**
 * Checks the user's answer against the multiplication problem on a drop and updates the game state accordingly.
 * 
 */
function checkAnswer() {
    let parsedAnswer = Number.parseInt(document.getElementById("answerInput").value);
    let foundCorrectDrop = true;

    // Loop to check if answer is correct
    while (foundCorrectDrop) {
        foundCorrectDrop = false;

        for (let i = 0; i < activeDrops.length; i++) {
            let drop = activeDrops[i];
            let multText = drop.textContent;
            let splitNum = multText.split(" ");
            if (parsedAnswer === parseInt(splitNum[0]) * parseInt(splitNum[2])) {
                svg.removeChild(drop);
                removeDropFromActiveDrops(drop);
                scoreCounter++;
                updateScoreDisplay();
                yspeed += 0.02; // the speed of drops increses whenever user enters the right answer
                foundCorrectDrop = true;
                break; // Exit loop to recheck activeDrops array
            }
        }
    }
    // Clear answer input value and focus
    document.getElementById("answerInput").focus();
    document.getElementById("answerInput").value = "";
}





/**
 * Updates the hearts display based on the current number of hearts remaining in the game.
 * 
 */
function updateHeartsDisplay() {
    const heartsDisplay = document.getElementById('heartsDisplay');

    switch (hearts) {
        case 5:
            heartsDisplay.innerHTML = 'Hearts: &#128155;&#128155;&#128155;&#128155;&#128155;';
            break;
        case 4:
            heartsDisplay.innerHTML = 'Hearts: &#128155;&#128155;&#128155;&#128155;&#10060;';
            break;
        case 3:
            heartsDisplay.innerHTML = 'Hearts: &#128155;&#128155;&#128155;&#10060;&#10060;';
            break;
        case 2:
            heartsDisplay.innerHTML = 'Hearts: &#128155;&#128155;&#10060;&#10060;&#10060;';
            break;
        case 1:
            heartsDisplay.innerHTML = 'Hearts: &#128155;&#10060;&#10060;&#10060;&#10060;';
            break;
        case 0:
            heartsDisplay.innerHTML = 'Hearts: &#10060;&#10060;&#10060;&#10060;&#10060;';
            break;
        default:
            break; // Adding default case with break
    }
}




/**
 * Updates the score display based on the current score in the game.
 * 
 */
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = 'Score: ' + scoreCounter;
}





/**
 * Switches the background to day mode by updating the SVG content with a day background.
 * 
 */
function day() {
    svg.innerHTML = `
    <defs>
        <!-- Gradient for the sky -->
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#25b3ff;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#61c8ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#eafaff;stop-opacity:1" />
        </linearGradient>
        <!-- Gradient for the sun -->
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" style="stop-color:#ffe418;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ffcc00;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff8800;stop-opacity:1" />
        </linearGradient>
        <!-- Gradient for the mountain -->
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" style="stop-color:#e3ff7d;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#b3e000;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6d9500;stop-opacity:1" />
        </linearGradient>
        <!-- Gradient for the clouds -->
        <linearGradient id="cloudsGradient" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#f3feff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d4f8ff;stop-opacity:1" />
        </linearGradient>                        
    </defs>
    
    <!-- Sky -->
    <rect x="0" y="0" width="400" height="400" fill="url(#skyGradient)"/>

    <!-- Clouds -->
    <g id="clouds" transform="translate(50 50)">
        <ellipse cx="0" cy="0" rx="20" ry="20" fill="url(#cloudsGradient)"/>
        <ellipse cx="30" cy="0" rx="30" ry="25" fill="url(#cloudsGradient)" />
        <ellipse cx="60" cy="0" rx="20" ry="20" fill="url(#cloudsGradient)" />
    </g>
    <use id= cloud1 href="#clouds" transform="translate(280 60)" />
    <use id= cloud2 href="#clouds" transform="translate(100 150)" />
    <use id= cloud3 href="#clouds" transform="translate(230 230)" />
    <use id= cloud4 href="#clouds" transform="translate(20 290)" />

    <!-- Sun -->
    <circle cx="200" cy="100" r="28" fill="url(#moonGradient)"/>

    <!-- Mountain -->
    <polygon points="30,400 100,350 150,380 250,310 350,365 400,290 400,400 " fill="url(#mountainGradient)"/>
    `;
}


/**
 * Toggles the background between day and night modes based on the 'sun' variable's value.
 * 
 */
function changeBackground() {
    if (sun == 1) {
        day();
        sun = 0;
    } else {
        svg.innerHTML = night;
        sun = 1;
    }
}




// Event listener for background change
svg.addEventListener('click', changeBackground);