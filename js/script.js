// Ослеживаем, когда контент страницы загрузится
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Объявление элементов
  const btnOpenModal = document.querySelector('#btnOpenModal'),
    modalBlock = document.querySelector('#modalBlock'),
    modalDialog = document.querySelector('.modal-dialog'),
    closeModal = document.querySelector('#closeModal'),
    questionTitle = document.querySelector('#question'),
    formAnswers = document.querySelector('#formAnswers'),
    buttonBurger = document.getElementById('buttonBurger'),
    buttonPrev = document.getElementById('prev'),
    buttonNext = document.getElementById('next'),
    buttonSend = document.getElementById('send');

  // Массив вопросов и ответов
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

  // Функция, отслеживающая изменение ширины окна
  const resizeWindow = () => {
    const clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 751) {
      buttonBurger.style.display = 'flex';
    } else {
      buttonBurger.style.display = 'none';
    }
  };

  // Основная функция, запускающая тестирование
  const playTest = () => {
    // Константа, хранящая массив ответов
    const finalAnswers = [];

    // Переменная текущего номер вопроса
    let numberQuestion = 0;

    // Функция рендеринга ответов на вопросы
    const renderAnswers = indexQuestion => {
      const type = questions[indexQuestion].type;
      questions[indexQuestion].answers.forEach(({ id, title, url }) => {
        const answerItem = document.createElement('div');
        answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
        answerItem.insertAdjacentHTML(
          'afterbegin',
          `
          <input type="${type}" id="${id}" name="answer" value="${title}" class="d-none" />
          <label for="${id}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${url}" alt="burger" />
            <span>${title}</span>
          </label>
          `
        );

        formAnswers.appendChild(answerItem);
      });
    };

    // Функция рендеринга кнопок навигации по тесту
    const renderButtons = indexQuestion => {
      switch (true) {
        case indexQuestion === 0:
          buttonNext.classList.remove('d-none');
          buttonPrev.classList.add('d-none');
          buttonSend.classList.add('d-none');
          break;
        case indexQuestion >= 1 && indexQuestion <= questions.length - 1:
          buttonPrev.classList.remove('d-none');
          buttonNext.classList.remove('d-none');
          buttonSend.classList.add('d-none');
          break;
        case indexQuestion === questions.length:
          buttonNext.classList.add('d-none');
          buttonSend.classList.remove('d-none');
          break;
        default:
          console.log('Что-то пошло не так');
      }
    };

    // Функция рендеринга вопросов, ответов и кнопок
    const renderQuestions = indexQuestion => {
      formAnswers.textContent = '';

      switch (true) {
        case indexQuestion >= 0 && indexQuestion <= questions.length - 1:
          questionTitle.textContent = questions[indexQuestion].question;
          renderAnswers(indexQuestion);
          renderButtons(indexQuestion);
          break;
        case indexQuestion === questions.length:
          questionTitle.textContent = 'Тест завершен';
          formAnswers.insertAdjacentHTML(
            'afterbegin',
            `
            <div class="form-group">
              <label for="inputPhone">Введите номер телефона</label>
              <input type="phone" class="form-control" id="inputPhone">
            </div>
            `
          );
          renderButtons(indexQuestion);
          break;
        default:
          console.log('Что-то пошло не так');
      }
    };

    // Функция проверки ответов на вопросы
    const checkAnswers = indexQuestion => {
      const answers = {};

      const inputs = [...formAnswers.elements].filter(input => input.checked || input.id === 'inputPhone');

      inputs.forEach((input, index) => {
        switch (true) {
          case indexQuestion >= 0 && indexQuestion <= questions.length - 1:
            answers[`${index}_${questions[indexQuestion].question}`] = input.value;
            break;
          case indexQuestion === questions.length:
            answers['0_Номер телефона'] = input.value;
            break;
          default:
            console.log('Что-то пошло не так');
        }
      });

      finalAnswers.push(answers);
    };

    // Функция перехода к предыдущему вопросу
    const prevQuestion = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };

    // Функия перехода к следующему вопросу
    const nextQuestion = () => {
      checkAnswers(numberQuestion);
      numberQuestion++;
      renderQuestions(numberQuestion);
    };

    // Функциия отправки ответов на тест
    const sendAnswers = () => {
      buttonPrev.classList.add('d-none');
      buttonSend.classList.add('d-none');

      checkAnswers(numberQuestion);
      console.log(finalAnswers);

      questionTitle.textContent = 'Спасибо!';
      formAnswers.textContent = 'Наш консультант свяжется с вами в течение 5 минут!';
      setTimeout(() => {
        modalBlock.classList.remove('d-block');
        buttonBurger.classList.remove('active');
      }, 3000);
    };

    // Запуск функции рендеринга первого вопроса
    renderQuestions(numberQuestion);

    // Обработчик клика по кнопке 'Предыдущий'
    buttonPrev.onclick = prevQuestion;

    // Обработчик клика по кнопке 'Следующий'
    buttonNext.onclick = nextQuestion;

    // Обработчик клика по кнопке 'Отправить'
    buttonSend.onclick = sendAnswers;
  };

  // Переменная для анимации
  let count = -100;

  // Функция анимации: окно появляется сверху
  const animateModal = () => {
    modalDialog.style.top = count + '%';
    count += 3;

    if (count < 0) {
      requestAnimationFrame(animateModal);
    } else {
      count = -100;
    }
  };

  // Вызываем функцию, отслеживающую изменение ширины окна
  resizeWindow();

  // Обработчкик открытия модального окна по клику на кнопку "Пройди тест"
  btnOpenModal.addEventListener('click', () => {
    modalDialog.style.top = count + '%';
    requestAnimationFrame(animateModal);

    modalBlock.classList.add('d-block');
    playTest();
  });

  // Обработчик открытия модального окна по клику на кнопку-бургер
  buttonBurger.addEventListener('click', () => {
    modalDialog.style.top = count + '%';
    requestAnimationFrame(animateModal);

    buttonBurger.classList.add('active');
    modalBlock.classList.add('d-block');
    playTest();
  });

  // Обработчик закрытия модального окна по клику на крестик
  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
    buttonBurger.classList.remove('active');
  });

  // Обработчик закрытия модального окна по клику на подложку
  modalBlock.addEventListener('click', event => {
    if (event.target.className === modalBlock.className) {
      modalBlock.classList.remove('d-block');
      buttonBurger.classList.remove('active');
    }
  });

  // Обработчик изменения ширины окна
  window.addEventListener('resize', resizeWindow);
});
