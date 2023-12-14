const htmlElement = (selector) => document.querySelector(selector);
const timeElement = htmlElement('#time');
const questionsElement = htmlElement('#questions');
const feedbackEl = htmlElement('#feedback');
const endScreenElement = htmlElement('#end-screen');
//const correctSound = ;
//let timer_bool=false;
//const startTime = 100;
//timeElement.textContent = startTime;
const maxQuestions = Object.entries(questions).length;
const deductTime = (time) => timeElement.textContent=parseInt(timeElement.textContent)-time;
const currentTime = () => parseInt(timeElement.textContent);

const Timer = () => ({
    setActive : (bool = timeElement.dataset.active)=>timeElement.dataset.active = bool.toString(), 
    setTime : (time = currentTime())=>timeElement.textContent = time,
    start : ()=>{setInterval(countdown, 1000); Timer().setActive(true)},
    stop : ()=>{clearInterval(countdown); Timer().setActive(false)},
    active : String(timeElement.dataset.active)
})

function countdown() {
    deductTime(1);
    if(currentTime()<1){
        outOfTime();
    }
}

Timer().setTime(100);

//function startTimer(){setInterval(countdown, 1000);}
function buildQuestion(questionNo){
    const questionTitleElement = htmlElement('#question-title');
    const choicesElement = htmlElement('#choices');
    questionTitleElement.textContent = questionNo.q;
    const answers = Object.values(questionNo.answers);
    const choices = `${answers.map(ans => `<button class="choice" data-correct="${ans.valid}">${ans.answer}</button>`).join('')}`;
    choicesElement.innerHTML=choices;
}

function nextQuestion(eventObj){
    if(eventObj.target.id==="start") {
        //timer_bool = true;
        //Timer(true)//.setActive;
        //startTimer();
        Timer().start();
        console.log(`timer bool: ${Timer().active}`);
        eventObj.target.parentNode.classList.toggle('hide');
        questionsElement.classList.toggle('hide');
    }
    if(questionsElement.dataset.nextQuestion==maxQuestions+1) {
        endScreen();
        return;
    }
    
    const currentQ = parseInt(questionsElement.dataset.nextQuestion) < maxQuestions ? parseInt(questionsElement.dataset.nextQuestion) : maxQuestions;
    buildQuestion(questions[currentQ]);
    questionsElement.setAttribute("data-next-question", currentQ+1);
}


function checkAnswer(eventObj) {
    if (eventObj.target.dataset.correct=='false'){
        console.log(eventObj.target.dataset.correct);
        //timeElement.textContent=parseInt(timeElement.textContent)-20;
        deductTime(20);
        feedbackEl.textContent = 'Wrong!'
        feedbackEl.classList.remove('hide');
        //feedbackToggle();
        setTimeout(toggleHide, 1000);
        if(currentTime()<1){
            console.log(`current time is: ${currentTime()}`)
            outOfTime();
        }
    }
    else {
        console.log(eventObj.target.dataset.correct);
        feedbackEl.textContent = 'Correct!'
        feedbackEl.classList.remove('hide');
        setTimeout(toggleHide, 1000);
        //feedbackToggle();
        //timeElement.textContent=parseInt(timeElement.textContent)+  5;
    }
    nextQuestion(eventObj);
}

function scoreSubmit(eventObj) {
    const initialsElement = htmlElement('#initials');
    localStorage.setItem(initialsElement.value, timeElement.textContent)
    location.href = "highscores.html";
}

function outOfTime(){
    endScreen();
    timeElement.textContent = 0;
    console.log(`Out of time!`);
}

function endScreen() {
    Timer().stop();
    //clearInterval(startTimer);
    //Timer().stop
    endScreenElement.classList.remove("hide");
    questionsElement.classList.add("hide");
}

function toggleHide() {
    feedbackEl.classList.add('hide');
}

addGlobalEventListener('click', nextQuestion, '#start');
addGlobalEventListener('click', checkAnswer, '.choice');
addGlobalEventListener('click', scoreSubmit, '#submit');

function addGlobalEventListener(typeOfEvent, callback, selector, stopPropagation=false) {
    document.addEventListener(typeOfEvent, (eventObj) => {
      if (eventObj.target.matches(selector)) callback(eventObj);
      if (stopPropagation) eventObj.stopPropagation();
    })
  }