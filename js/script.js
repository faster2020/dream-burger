document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const btnOpenModal = document.querySelector('#btnOpenModal'),
    modalBlock = document.querySelector('#modalBlock'),
    closeModal = document.querySelector('#closeModal'),
    questionTitle = document.querySelector('#question'),
    formAnswers = document.querySelector('#formAnswers');

  const playTest = () => {
    const question = {
      title: 'Какого цвета бургер выберите?',
      answers: [
        {
          id: 'answerItem1',
          title: 'Стандарт',
          image: './img/burger.png',
        },
        {
          id: 'answerItem2',
          title: 'Черный',
          image: './img/burgerBlack.png',
        },
      ],
    };

    const renderQuestion = question => {
      questionTitle.textContent = question.title;
      formAnswers.textContent = '';

      question.answers.forEach(({ id, title, image }) => {
        const answer = `
          <div class="answers-item d-flex flex-column">
            <input type="radio" id="${id}" name="answer" class="d-none" />
            <label for="${id}" class="d-flex flex-column justify-content-between">
              <img class="answerImg" src="${image}" alt="burger" />
              <span>${title}</span>
            </label>
          </div>
        `;
        formAnswers.insertAdjacentHTML('beforeend', answer);
      });
    };

    renderQuestion(question);
  };

  btnOpenModal.addEventListener('click', () => {
    modalBlock.classList.add('d-block');
    playTest();
  });

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
  });

  modalBlock.addEventListener('click', event => {
    if (event.target.className === modalBlock.className) {
      modalBlock.classList.remove('d-block');
    }
  });
});
