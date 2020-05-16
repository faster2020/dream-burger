document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const btnOpenModal = document.querySelector('#btnOpenModal'),
    modalBlock = document.querySelector('#modalBlock'),
    closeModal = document.querySelector('#closeModal'),
    questionTitle = document.querySelector('#question'),
    formAnswers = document.querySelector('#formAnswers'),
    buttonBurger = document.getElementById('buttonBurger'),
    buttonPrev = document.getElementById('prev'),
    buttonNext = document.getElementById('next');

  const resizeWindow = () => {
    const clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 751) {
      buttonBurger.style.display = 'flex';
    } else {
      buttonBurger.style.display = 'none';
    }
  };

  const playTest = () => {
    let numberQuestion = 0;
    const questions = [
      {
        question: 'Какого цвета бургер?',
        answers: [
          {
            id: '00',
            title: 'Стандарт',
            url: './img/burger.png',
          },
          {
            id: '01',
            title: 'Черный',
            url: './img/burgerBlack.png',
          },
        ],
        type: 'radio',
      },
      {
        question: 'Из какого мяса котлета?',
        answers: [
          {
            id: '10',
            title: 'Курица',
            url: './img/chickenMeat.png',
          },
          {
            id: '11',
            title: 'Говядина',
            url: './img/beefMeat.png',
          },
          {
            id: '12',
            title: 'Свинина',
            url: './img/porkMeat.png',
          },
        ],
        type: 'radio',
      },
      {
        question: 'Дополнительные ингредиенты?',
        answers: [
          {
            id: '20',
            title: 'Помидор',
            url: './img/tomato.png',
          },
          {
            id: '21',
            title: 'Огурец',
            url: './img/cucumber.png',
          },
          {
            id: '22',
            title: 'Салат',
            url: './img/salad.png',
          },
          {
            id: '23',
            title: 'Лук',
            url: './img/onion.png',
          },
        ],
        type: 'checkbox',
      },
      {
        question: 'Добавить соус?',
        answers: [
          {
            id: '30',
            title: 'Чесночный',
            url: './img/sauce1.png',
          },
          {
            id: '31',
            title: 'Томатный',
            url: './img/sauce2.png',
          },
          {
            id: '32',
            title: 'Горчичный',
            url: './img/sauce3.png',
          },
        ],
        type: 'radio',
      },
    ];

    const renderAnswers = indexQuestion => {
      const type = questions[indexQuestion].type;
      questions[indexQuestion].answers.forEach(({ id, title, url }) => {
        const answerItem = document.createElement('div');
        answerItem.classList.add('answers-item', 'd-flex', 'flex-column');
        answerItem.insertAdjacentHTML(
          'afterbegin',
          `
          <input type="${type}" id="${id}" name="answer" class="d-none" />
          <label for="${id}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${url}" alt="burger" />
            <span>${title}</span>
          </label>
          `
        );

        formAnswers.appendChild(answerItem);
      });
    };

    const renderButtons = indexQuestion => {
      if (indexQuestion < 1) {
        buttonPrev.style.display = 'none';
      } else {
        buttonPrev.style.display = '';
      }

      if (indexQuestion > questions.length - 2) {
        buttonNext.style.display = 'none';
      } else {
        buttonNext.style.display = '';
      }
    };

    const renderQuestions = indexQuestion => {
      questionTitle.textContent = questions[indexQuestion].question;
      formAnswers.textContent = '';

      renderAnswers(indexQuestion);
      renderButtons(indexQuestion);
    };

    const prevQuestion = () => {
      numberQuestion--;

      renderQuestions(numberQuestion);
      renderButtons(numberQuestion);
    };

    const nextQuestion = () => {
      numberQuestion++;

      renderQuestions(numberQuestion);
      renderButtons(numberQuestion);
    };

    renderQuestions(numberQuestion);

    buttonPrev.onclick = prevQuestion;
    buttonNext.onclick = nextQuestion;
  };

  btnOpenModal.addEventListener('click', () => {
    modalBlock.classList.add('d-block');
    playTest();
  });

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
    buttonBurger.classList.remove('active');
  });

  modalBlock.addEventListener('click', event => {
    if (event.target.className === modalBlock.className) {
      modalBlock.classList.remove('d-block');
      buttonBurger.classList.remove('active');
    }
  });

  buttonBurger.addEventListener('click', () => {
    buttonBurger.classList.add('active');
    modalBlock.classList.add('d-block');
    playTest();
  });

  window.addEventListener('resize', resizeWindow);

  resizeWindow();
});
