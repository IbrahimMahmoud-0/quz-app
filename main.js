const body = document.querySelector('body');
const countSpan = document.querySelector(' .count span');

const spansContianer = document.querySelector('.spans');

const quizArea = document.querySelector('.quiz-area');

const answerArea = document.querySelector('.answers-area');

const submitBtn = document.querySelector('.submit-button');

const resultsContianer = document.querySelector('.results');

const quizApp = document.querySelector('.quiz-app');

const quizMin = document.querySelector('.minutes');
const quizSec = document.querySelector('.seconds');

const countDownContianer = document.querySelector('.countdown');
let currIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let timeOFQuiz = 4; //minutes

const getQuestions = async function () {
  try {
    const myRequest = await fetch('html_questions.json');
    if (!myRequest.ok) throw new Error('Unable to find the path! ');
    const data = await myRequest.json();
    let questionsCount = data.length;
    createBullets(questionsCount);
    createSpans(questionsCount, currIndex);
    addQuestionData(data[currIndex], questionsCount);

    countDown(timeOFQuiz, questionsCount);

    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currIndex === questionsCount) return;

      let rightAnswer = data[currIndex].right_answer;
      currIndex++;

      checkRightAnswer(rightAnswer, questionsCount);
      quizArea.innerHTML = answerArea.innerHTML = '';
      addQuestionData(data[currIndex], questionsCount);
      //handling bullets
      // spansContianer.innerHTML = '';
      // createSpans(questionsCount, currIndex);
      handleBullets();
      clearInterval(countDownInterval);
      countDown(timeOFQuiz, questionsCount);
      showResults(questionsCount);
    });
  } catch (e) {
    console.error(e);
  }
};

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
}

function createSpans(num, currIndex) {
  for (let i = 0; i < num; i++) {
    const span = document.createElement('span');
    if (i === currIndex) {
      span.className = 'on';
    }
    spansContianer.insertAdjacentElement('beforeend', span);
  }
}

function addQuestionData(obj, count) {
  if (currIndex < count) {
    let questionTitle = document.createElement('h2');

    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement('div');
      mainDiv.className = 'answer';

      let radioInput = document.createElement('input');
      radioInput.name = 'question';
      radioInput.type = 'radio';
      radioInput.id = `answer_${i + 1}`;
      radioInput.dataset.answer = obj[`answer_${i + 1}`];
      if (i === 0) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement('label');
      theLabel.htmlFor = `answer_${i + 1}`;
      let theLabelText = document.createTextNode(obj[`answer_${i + 1}`]);

      theLabel.appendChild(theLabelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      // console.log(typeof mainDiv);
      answerArea.appendChild(mainDiv);
      // answerArea.insertAdjacentElement("beforeend", mainDiv);
    }
  }
}

function checkRightAnswer(correctAns, qCount) {
  let answers = document.getElementsByName('question');
  let [chosenAnswer] = [...answers]
    .filter(ans => ans.checked)
    .map(ans => ans.dataset.answer);
  // console.log(chosenAnswer);
  if (chosenAnswer === correctAns) {
    rightAnswers++;
  }
}
function handleBullets() {
  const spans = spansContianer.querySelectorAll('span');
  spans.forEach((span, i) => {
    i === currIndex ? (span.className = 'on') : '';
  });
}

function showResults(count) {
  let results;
  if (currIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    spansContianer.closest('.bullets').remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      results = `<span class="good">Good</span>,${rightAnswers} From ${count} Is Good.`;
      body.style.backgroundColor = 'cyan';
    } else if (rightAnswers === count) {
      results = `<span class="perfect">Perfect</span>,All Answers Are Correct! .`;
      body.style.backgroundColor = 'royalblue';
    } else {
      results = `<span class="bad">Bad</span>,You Faild successfully!! .`;
      body.style.backgroundColor = 'red';
    }
    body.classList.add('flex');
    resultsContianer.innerHTML = results;
  }
}

function countDown(duration, count) {
  if (currIndex < count) {
    let time = duration * 60;
    countDownInterval = setInterval(function () {
      const minutes = String(Math.trunc(time / 60)).padStart(2, '0');
      // if time is 100 and the sec is 60 (100-60)= 40 sec the remain
      const sec = String(Math.trunc(time % 60)).padStart(2, 0);
      // console.log(minutes);

      time--;
      if (time < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
      countDownContianer.innerHTML = `${minutes}:${sec}`;
    }, 1000);
  }
}
// countDown();
