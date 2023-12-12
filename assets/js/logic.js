const htmlElement = (selector) => document.querySelector(selector);
const timeElement = htmlElement('#time');
const questionsElement = htmlElement('#questions');
let timer_bool=false;

function ScoreSubmit(eventObj) {
    const initialsElement = htmlElement('#initials');
    localStorage.setItem(initialsElement.value, timeElement.textContent)
    location.href = "highscores.html";
}

function BuildQuestion(questionNo){
    const questionTitleElement = htmlElement('#question-title');
    const choicesElement = htmlElement('#choices');
    questionTitleElement.textContent = questionNo.q;
    const answers = Object.values(questionNo.answers);
    const choices = `${answers.map(ans => `<button class="choice" data-correct="${ans.valid}">${ans.answer}</button>`).join('')}`;
    choicesElement.innerHTML=choices;
}

function NextQuestion(eventObj){
    const endScreenElement = htmlElement('#end-screen');
    const maxQuestions = Object.entries(questions).length;
    if(eventObj.target.id==="start") {
        console.log('test')
        timer_bool = true;
        //StartTimer(/* timer_bool */);
        //console.log(timer_bool);
        eventObj.target.parentNode.classList.toggle('hide');
        questionsElement.classList.toggle('hide');
    }
    if(questionsElement.dataset.nextQuestion==maxQuestions+1) {
        console.log('test2')
        timer_bool=false;
        //StartTimer(/* timer_bool */);
        clearInterval(StartTimer);
        endScreenElement.classList.toggle("hide")
        questionsElement.classList.toggle("hide")
        return;
    }
    
    const currentQ = parseInt(questionsElement.dataset.nextQuestion) < maxQuestions ? parseInt(questionsElement.dataset.nextQuestion) : maxQuestions;
    BuildQuestion(questions[currentQ]);
    questionsElement.setAttribute("data-next-question", currentQ+1);
}

function CheckAnswer(eventObj) {
    if (eventObj.target.dataset.correct=='false'){
        console.log(eventObj.target.dataset.correct);
        timeElement.textContent=parseInt(timeElement.textContent)-15;
    }/* 
    else {
        console.log(eventObj.target.dataset.correct);
        timeElement.textContent=parseInt(timeElement.textContent)-15;
    } */
    NextQuestion(eventObj);
}

function StartTimer(){
    if(timer_bool){
        timeElement.textContent = parseInt(timeElement.textContent)-1;
        }
}
setInterval(StartTimer, 1000);

/* function OutOfTime(){
    if(parseInt(timeElement.textContent)===0){

    }
} */

AddGlobalEventListener('click', NextQuestion, '#start');
AddGlobalEventListener('click', CheckAnswer, '.choice');
AddGlobalEventListener('click', ScoreSubmit, '#submit');

function AddGlobalEventListener(typeOfEvent, callback, selector, stopPropagation=false) {
    document.addEventListener(typeOfEvent, (eventObj) => {
      if (eventObj.target.matches(selector)) callback(eventObj);
      if (stopPropagation) eventObj.stopPropagation();
    })
  }