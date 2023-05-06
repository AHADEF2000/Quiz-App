// select elements
let countContainer = document.querySelector('.count span');
let bullets = document.querySelector('.bullets');
let bulletsContainer = document.querySelector('.bullets .spans');
let qestionArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let btn = document.querySelector('#submit-btn');
let result = document.querySelector('.result');
let countdownElement = document.querySelector('.countdown');
// set options
let currentIndex = 0;
let theRightAnswer = 0;
let countdownInterval;

// get question function 
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "html_questions.json");
    myRequest.send();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let jsonData = JSON.parse(this.responseText)
            let questionCount = jsonData.length;

            // Create bullets + question count
            createBullets(questionCount);

            // Add question data
            addData(jsonData[currentIndex], questionCount);

            // start countdown 
            countdown(5, questionCount)

            // add Click btn
            btn.addEventListener('click', (e) => {
                // define the right answer
                let theRightAnswer = jsonData[currentIndex].right_answer;
                // increase the index 
                currentIndex++;
                // check the right answer function
                checkAnswer(theRightAnswer, questionCount);
                // remove previos question
                qestionArea.innerHTML = '';
                answersArea.innerHTML = '';
                // adding the next question
                addData(jsonData[currentIndex], questionCount);
                // Handle the bullets class
                handleButllets(questionCount);
                // add countdown function
                clearInterval(countdownInterval);
                countdown(5, questionCount)
                // show result function
                showResult(questionCount);

            });

        }
    }
}
getQuestions();

// create bullet function
function createBullets(num) {
    countContainer.innerHTML = num;

    // create spans
    for (let i = 0; i < num; i++) {
        // create bullet
        let bulletSpan = document.createElement('span');
        // if condintion 
        if (i === 0) {
            bulletSpan.className = 'on';
        }
        // appened the bullet in the contianer
        bulletsContainer.appendChild(bulletSpan);
    }
}

// adding data function
function addData(obj, count) {
    if (currentIndex < count) {
        // Create question title 
        let questionTitle = document.createElement('h2');
        // create text inside the title
        let questionText = document.createTextNode(obj.title);
        //appened the text inside the qs title 
        questionTitle.appendChild(questionText);
        // appened the h2 inside the continer
        qestionArea.appendChild(questionTitle)
        // create answers
        for (let i = 1; i <= 4; i++) {
            // create main div
            let answerContanier = document.createElement('div');
            // adding class to main div
            answerContanier.className = 'answer';
            // create input
            let answerInput = document.createElement('input');
            // adding attributes for the input
            answerInput.type = 'radio';
            answerInput.name = 'question';
            answerInput.id = `answer_${i}`;
            // make the first child be checked
            if (i === 1) {
                answerInput.checked = true;
            }
            answerInput.dataset.answer = obj[`answer_${i}`];
            // create lable
            let answerLabel = document.createElement('label');
            // adding the for attribute to the lable
            answerLabel.htmlFor = `answer_${i}`;  // This makes the text associated with the corresponding radio input clickable
            // creating the text for the label
            let answerLabelText = document.createTextNode(obj[`answer_${i}`]);
            // appeneding the text to the label
            answerLabel.appendChild(answerLabelText);
            // appending the input and the lable to the main div
            // If you want to append multiple child nodes to a parent node, you need to call the appendChild() method multiple times, once for each child node. 
            answerContanier.appendChild(answerInput);
            answerContanier.appendChild(answerLabel);
            // appending the main div to the answer area
            answersArea.appendChild(answerContanier);
        }
    }
}

// check the answer function
function checkAnswer(rightAnsw, questionCount) {

    let answers = document.getElementsByName('question'); // to get the element in the input we can selected it by the name
    let theChosenAns;

    // loop on the inputs
    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theChosenAns = answers[i].dataset.answer;
        }
    }
    if (theChosenAns === rightAnsw) {
        theRightAnswer++;
    }

}

// handle bullet function
function handleButllets() {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let bulletArray = Array.from(bulletsSpan);


    bulletArray.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    })
}

// show result function

function showResult(count) {
    let theResult;
    let resultSpan = document.createElement('span');
    let resultText;


    if (currentIndex === count) {
        qestionArea.remove();
        answersArea.remove();
        bullets.remove();
        btn.remove();

        if (theRightAnswer > count / 2 && theRightAnswer < count) {
            theResult = `<span class="good">Good</span>, ${theRightAnswer} From ${count}`;
        } else if (theRightAnswer === count) {
            theResult = `<span class="perfect">Perfect</span>, You answered all the question correctly`;
        } else {
            theResult = `<span class="bad">Failed</span>, ${theRightAnswer} From ${count}`;
        }

        result.innerHTML = theResult;
        result.style.padding = "10px";
        result.style.backgroundColor = "white";
        result.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let min, sec;
        countdownInterval = setInterval(function () {
            min = parseInt(duration / 60);
            sec = parseInt(duration % 60);

            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;

            countdownElement.innerHTML = `${min}:${sec}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                btn.click();
            }
        }, 1000);
    }
}









