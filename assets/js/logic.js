const htmlElement = (selector) => document.querySelector(selector);
const timeElement = htmlElement('#time');
const questionsElement = htmlElement('#questions');
const feedbackEl = htmlElement('#feedback');
const endScreenElement = htmlElement('#end-screen');
const penaltyElement = htmlElement('#penalty');
const penalty = 20//parseInt(penaltyElement.dataset.penalty);
penaltyElement.textContent = penalty;

const correct = document.createElement("audio");
correct.setAttribute("src","assets/sfx/correct.wav");
const incorrect = document.createElement("audio")
incorrect.setAttribute("src","assets/sfx/incorrect.wav");
const sounds = [correct, incorrect];
const stopSounds = (s = sounds) => s.forEach(sound => {sound.pause(); sound.currentTime = 0;});
function correctPlay  () {stopSounds(); correct.play();}
function incorrectPlay () {stopSounds(); incorrect.play();}

// Timer object 
const Timer = {
    timerInterval: undefined,
    timeoutInterval: undefined,
    timeoutSet: (callBack)=> Timer.timeoutInterval = setTimeout(callBack, 1000),
    timeoutClr: ()=> clearTimeout(Timer.timeoutInterval),
    setActive : (bool = timeElement.dataset.active)=> timeElement.dataset.active = bool.toString(), 
    active : ()=> String(timeElement.dataset.active),
    setTime : (time = Timer.getTime())=> timeElement.textContent = time,
    getTime : ()=> parseInt(timeElement.textContent),
    start : ()=> {Timer.timerInterval = setInterval(Timer.countdown, 1000); Timer.setActive(true)},
    stop : ()=> {clearInterval(Timer.timerInterval); Timer.setActive(false)},
    deductTime : (time)=> timeElement.textContent=Timer.getTime()-time,
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
        Timer.timeoutClr();
        Timer.timeoutSet(toggleFeedback);
        Timer.deductTime(penalty);
        incorrectPlay();
        if(Timer.getTime()<1 || wrongAnswers===maxQuestions){
            console.log(`current time is: ${Timer.getTime()}`)
            //console.log(`checkAnswer() called`);
            Timer.outOfTime();
        }
    }
    else {
        console.log(eventObj.target.dataset.correct);
        feedbackEl.textContent = 'Correct!'
        feedbackEl.classList.remove('hide');
        Timer.timeoutClr();
        Timer.timeoutSet(toggleFeedback);
        correctPlay();
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

function toggleFeedback() {
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