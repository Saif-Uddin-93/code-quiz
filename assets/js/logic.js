const htmlElement = (selector) => document.querySelector(selector);
const questionsElement = htmlElement('#questions');
const questionTitleElement = htmlElement('#question-title');
const choicesElement = htmlElement('#choices');
const endScreenElement = htmlElement('#end-screen');
const initialsElement = htmlElement('#initials');
const timeElement = htmlElement('#time');

function Round () {}
function ScoreSubmit(eventObj) {
    //eventObj.preventDefault();
    localStorage.setItem(initialsElement.value, timeElement.textContent)
    location.href = "highscores.html";
}

function BuildQuestion(questionNo){
    //console.log(questionNo.q);
    questionTitleElement.textContent = questionNo.q;
    answers = Object.values(questionNo.answers);
    //console.log(answers);
    const choices = `${answers.map(ans => `<button class="choice">${ans}</button>`).join('')}`;
    //console.log(choices);
    choicesElement.innerHTML=choices;
}

function NextQuestion(eventObj){
    //console.log(eventObj.target.textContent);
    if(eventObj.target.parentNode.id==="start-screen") {
        eventObj.target.parentNode.classList.toggle('hide');
        questionsElement.classList.toggle('hide');
    }
    if(questionsElement.dataset.nextQuestion==6) {
        endScreenElement.classList.toggle("hide")
        questionsElement.classList.toggle("hide")
        return;
    }
    //console.log(eventObj.target.dataset.nextQuestion<Object.keys(questions).length);
    const currentQ = (parseInt(questionsElement.dataset.nextQuestion) < Object.keys(questions).length) ? parseInt(questionsElement.dataset.nextQuestion) : Object.keys(questions).length;
    //console.log(Object.keys(questions).length);
    BuildQuestion(questions[currentQ]);
    questionsElement.setAttribute("data-next-question", currentQ+1);
    //console.log(questionsElement.getAttribute("data-next-question"));
}

AddGlobalEventListener('click', NextQuestion, '#start');
AddGlobalEventListener('click', NextQuestion, '.choice');
AddGlobalEventListener('click', ScoreSubmit, '#submit');

function AddGlobalEventListener(typeOfEvent, callback, selector, stopPropagation=false) {
    document.addEventListener(typeOfEvent, (eventObj) => {
      if (eventObj.target.matches(selector)) callback(eventObj);
      if (stopPropagation) eventObj.stopPropagation();
    })
  }