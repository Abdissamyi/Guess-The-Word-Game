// Setting game name 
let gameName = "Guess The World" ;
document.title = gameName ;
document.querySelector("h1").innerHTML = gameName ;
document.querySelector("footer").innerHTML = `&copy; ${gameName} is a game created by Abdissamyi` ;

// setting game options 
let numberOfTries = 6 ;
let numberOfLetters = 6 ;
let currentTry = 1 ;
let numberOfHints = 2 ;



// manage word 
let wordToGuess = "" ;
const words = ["delete" , "create" , "update" , "master" , "branch" , "mainly" , "elzero" , "school" , "select" , ] ;
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase() ;

let messageArea = document.querySelector(".message") ;

console.log(wordToGuess) ; 

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints ;
const getHintButton = document.querySelector(".hint") ;
getHintButton.addEventListener("click" , getHint) ;



function generateInput(){
    const inputsContainer = document.querySelector(".inputs");

    for (let i = 1 ; i <= numberOfTries ; i++ ){
        const TryDiv = document.createElement("div") ;
        TryDiv.classList.add(`Try-${i}`) ;
        TryDiv.innerHTML = `<span>Try ${i}<span/>` ;

        if(i !== 1) TryDiv.classList.add("disabled-input");

        // cerate inputs 

        for(let j = 1 ; j <= numberOfLetters ; j++){
            const input = document.createElement("input") ;
            input.type = "text" ;
            input.id = `guess-${i}-letter-${j}` ;
            input.setAttribute("maxlength" , "1")
            TryDiv.appendChild(input) ;
        }

        inputsContainer.appendChild(TryDiv) ;
    } 
    inputsContainer.children[0].children[1].focus() ;

    // disabled all input except the first one 
    const inputInDisabledDiv = document.querySelectorAll(".disabled-input input") ;
    inputInDisabledDiv.forEach((input) => (input.disabled = true )) ;

    // convert input to upper case 
    const inputs = document.querySelectorAll("input") ;
    inputs.forEach((input , index) => {
        input.addEventListener("input" , function(){
            this.value = this.value.toUpperCase() ;

            const nextInput = inputs[index + 1] ;

            if (nextInput) nextInput.focus() ;
        }) ;

        input.addEventListener("keydown" , function(event){
            const currentIndex = Array.from(inputs).indexOf(event.target) ; // or this in the indexOf 

            if(event.key === "ArrowRight"){
                const nextInput = currentIndex + 1 ;
                if(nextInput < inputs.length) inputs[nextInput].focus() ;
            }
            if(event.key === "ArrowLeft"){
                const priviousInput = currentIndex - 1 ;
                if(priviousInput >= 0) inputs[priviousInput].focus() ;
            }
        });
    }) ;
}

const guessbutton = document.querySelector(".check") ;
guessbutton.addEventListener("click" , handleGuesses) ;

function handleGuesses(){
    let successGuess = true ;
    for(let i = 1 ; i <= numberOfLetters ; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`) ;
        const letter = inputField.value.toLowerCase() ;
        const actualLetter = wordToGuess[i - 1] ;

        // Game logic 
        if(letter === actualLetter){
            // letter is correct and in place 
            inputField.classList.add("yes-in-place") ;
        }
        else if(wordToGuess.includes(letter) && letter !== ""){
            // letter is correct but not in place 
            inputField.classList.add("not-in-place") ;
            successGuess = false ;
        }
        else{
            inputField.classList.add("no") ;
            successGuess = false ;
        }
    }
    // check if user win or lose 
    if(successGuess)  {
        messageArea.innerHTML = `You win the word is <span>${wordToGuess}</span>`;
        if(numberOfHints === 2) {
            messageArea.innerHTML = `You win the word is <span>${wordToGuess}</span> <br><p>Congrats you didn't use Hints</p>`
        }

        // add disabled class on all try divs 
        let allTries = document.querySelectorAll(".inputs > div") ;
        allTries.forEach((TryDiv) => TryDiv.classList.add("disabled-input")) ;

        // disabled the check button 
        guessbutton.disabled = true ;
        getHintButton.disabled = true ;

    }
    else {
        console.log("you lose")
        document.querySelector(`.Try-${currentTry}`).classList.add("disabled-input");
        const currentTryInputs = document.querySelectorAll(`.Try-${currentTry} inputs`) ;
        currentTryInputs.forEach((input) => (input.disabled = true)) ;

        currentTry++ ;

        
        const nextTryInput = document.querySelectorAll(`.Try-${currentTry} input`) ;
        nextTryInput.forEach((input) => (input.disabled = false)) ;

        let el = document.querySelector(`.Try-${currentTry}`) ;
        if(el){
            document.querySelector(`.Try-${currentTry}`).classList.remove("disabled-input");
            el.children[1].focus() ;
        }
        else{
            // disabled the check button 
            guessbutton.disabled = true ;
            getHintButton.disabled = true ;
            messageArea.innerHTML = `You lose the world is <span>${wordToGuess}</span>`
        }

    }
}

function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints
    }
    if(numberOfHints === 0){
        getHintButton.disabled = true ;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])") ;
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "") ;

    if (emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length) ;
        const randomInput = emptyEnabledInputs[randomIndex] ;
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput)

        if(indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toLocaleUpperCase() ;
        }
    }
}

function handleBackspace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])") ;
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0 ){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1] ;
            currentInput.value = "" ;
            prevInput.value = "" ;
            prevInput.focus(); 
        }
    }
}

document.addEventListener("keydown" , handleBackspace) ;

window.onload = function(){
    generateInput(); 
};