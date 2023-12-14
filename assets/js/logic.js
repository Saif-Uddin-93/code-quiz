const htmlElement = (selector) => document.querySelector(selector);
const timeElement = htmlElement('#time');
const questionsElement = htmlElement('#questions');
const feedbackEl = htmlElement('#feedback');
const endScreenElement = htmlElement('#end-screen');
//const correctSound = ;
let timer_bool=false;
let deductTime = (time) => timeElement.textContent=parseInt(timeElement.textContent)-time;

function buildQuestion(questionNo){
    const questionTitleElement = htmlElement('#question-title');
    const choicesElement = htmlElement('#choices');
    questionTitleElement.textContent = questionNo.q;
    const answers = Object.values(questionNo.answers);
    const choices = `${answers.map(ans => `<button class="choice" data-correct="${ans.valid}">${ans.answer}</button>`).join('')}`;
    choicesElement.innerHTML=choices;
}

function nextQuestion(eventObj){
    const maxQuestions = Object.entries(questions).length;
    if(eventObj.target.id==="start") {
        timer_bool = true;
        eventObj.target.parentNode.classList.toggle('hide');
        questionsElement.classList.toggle('hide');
    }
    if(questionsElement.dataset.nextQuestion==maxQuestions+1) {
        timer_bool=false;
        clearInterval(startTimer);
        endScreenElement.classList.toggle("hide")
        questionsElement.classList.toggle("hide")
        return;
    }
    
    const currentQ = parseInt(questionsElement.dataset.nextQuestion) < maxQuestions ? parseInt(questionsElement.dataset.nextQuestion) : maxQuestions;
    buildQuestion(questions[currentQ]);
    questionsElement.setAttribute("data-next-question", currentQ+1);
}

function checkAnswer(eventObj) {
    if (eventObj.target.dataset.correct=='false'){
        console.log(eventObj.target.dataset.correct);
        timeElement.textContent=parseInt(timeElement.textContent)-20;
        feedbackEl.textContent = 'Wrong!'
        feedbackEl.classList.remove('hide');
        //feedbackToggle();
        setTimeout(toggleHide, 1000);
        /* if(){

        } */
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

function startTimer() {
    if(timer_bool){
        timeElement.textContent = parseInt(timeElement.textContent)-1;
        if(parseInt(timeElement.textContent)<1){
            outOfTime();
        }
    }
}

function outOfTime(){
    timer_bool = false;
    clearInterval(startTimer);
    timeElement.textContent = 0;
    endScreenElement.classList.toggle("hide")
    questionsElement.classList.toggle("hide")
}

function toggleHide() {
    feedbackEl.classList.add('hide');
}

setInterval(startTimer, 1000);

addGlobalEventListener('click', NextQuestion, '#start');
addGlobalEventListener('click', CheckAnswer, '.choice');
addGlobalEventListener('click', ScoreSubmit, '#submit');

function addGlobalEventListener(typeOfEvent, callback, selector, stopPropagation=false) {
    document.addEventListener(typeOfEvent, (eventObj) => {
      if (eventObj.target.matches(selector)) callback(eventObj);
      if (stopPropagation) eventObj.stopPropagation();
    })
  }