const htmlElement = (selector) => document.querySelector(selector);
const timeElement = htmlElement('#time');
const questionsElement = htmlElement('#questions');
const feedbackEl = htmlElement('#feedback');
const endScreenElement = htmlElement('#end-screen');

const Timer = {
    timeInterval: undefined,
    setActive : (bool = timeElement.dataset.active)=>timeElement.dataset.active = bool.toString(), 
    active : ()=> String(timeElement.dataset.active),
    setTime : (time = Timer.getTime())=>timeElement.textContent = time,
    getTime : ()=> parseInt(timeElement.textContent),
    start : ()=> {Timer.timeInterval = setInterval(Timer.countdown, 1000); Timer.setActive(true)},
    stop : ()=> {clearInterval(Timer.timeInterval); Timer.setActive(false)},
    deductTime : (time) => timeElement.textContent=Timer.getTime()-time,
    countdown: ()=> {Timer.deductTime(1); if(Timer.getTime()<1) Timer.outOfTime();},
    outOfTime: ()=> {Timer.setTime(0); endScreen();},
}

Timer.setTime(100);

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
        Timer.start();
        console.log(`timer bool: ${Timer.active()}`);
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
        wrongAnswers++;
        feedbackEl.textContent = 'Wrong!'
        feedbackEl.classList.remove('hide');
        setTimeout(toggleHide, 1000);
        if(Timer.getTime()<1){
            console.log(`current time is: ${getTime()}`)
            //console.log(`checkAnswer() called`);
            Timer.outOfTime();
        }
        if(wrongAnswers===maxQuestions){
            Timer.outOfTime();
        }
        Timer.deductTime(20);
    }
    else {
        console.log(eventObj.target.dataset.correct);
        feedbackEl.textContent = 'Correct!'
        feedbackEl.classList.remove('hide');
        setTimeout(toggleHide, 1000);
    }
    nextQuestion(eventObj);
}

function scoreSubmit(eventObj) {
    const initialsElement = htmlElement('#initials');
    localStorage.setItem(initialsElement.value, timeElement.textContent)
    location.href = "highscores.html";
}

function endScreen() {
    Timer.stop();
    endScreenElement.classList.remove("hide");
    questionsElement.classList.add("hide");
    htmlElement("#final-score").textContent = Timer.getTime();
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