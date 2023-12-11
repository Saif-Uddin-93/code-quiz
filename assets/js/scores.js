htmlElement = (selector) => document.querySelector(selector);

const highscoreElement = htmlElement('#highscores');
let index = 0;
let names = Object.keys(localStorage);
let scores = Object.values(localStorage);
//console.log(names, scores)

let combinedArray = scores.map((element, index) => ({ element, index })).sort((a, b) => b.element - a.element);

scores = combinedArray.map(obj => scores[obj.index]);
names = combinedArray.map(obj => names[obj.index]);

console.log(scores);
console.log(names);

let scoreList='';
for (let i = 0; i<names.length; i++) {
    scoreList += `<li>${names[i]} - ${scores[i]}</li>`;
}
highscoreElement.innerHTML = scoreList;