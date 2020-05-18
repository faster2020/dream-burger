// Ослеживаем, когда контент страницы загрузится
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Объявление элементов
  const btnOpenModal = document.querySelector('#btnOpenModal'),
    modalBlock = document.querySelector('#modalBlock'),
    modalDialog = document.querySelector('.modal-dialog'),
    closeModal = document.querySelector('#closeModal'),
    modalTitle = document.querySelector('.modal-title'),
    questionTitle = document.querySelector('#question'),
    formAnswers = document.querySelector('#formAnswers'),
    buttonBurger = document.getElementById('buttonBurger'),
    buttonPrev = document.getElementById('prev'),
    buttonNext = document.getElementById('next'),
    buttonSend = document.getElementById('send');

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyB38PcDVPkhI6vAXWufqaL6fXlApeeSMdI',
    authDomain: 'dream-burger-c7919.firebaseapp.com',
    databaseURL: 'https://dream-burger-c7919.firebaseio.com',
    projectId: 'dream-burger-c7919',
    storageBucket: 'dream-burger-c7919.appspot.com',
    messagingSenderId: '29347107095',
    appId: '1:29347107095:web:0d14242a252641ead8e752',
    measurementId: 'G-MDJTH66ER0',
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Получение данных через fetch
  // const getData = () => {
  //   modalTitle.textContent = 'Ожидайте...';
  //   questionTitle.textContent = 'Данные загружаются...';
  //   formAnswers.textContent = '';

  //   setTimeout(() => {
  //     fetch('./db/questions.json')
  //       .then(responce => responce.json())
  //       .then(data => playTest(data.questions))
  //       .catch(err => {
  //         questionTitle.textContent = 'Ошибка загрузки данных!';
  //         console.error(err);
  //       });
  //   }, 2000);
  // };

  // Получение данных из Firebase
  const getData = () => {
    modalTitle.textContent = 'Ожидайте...';
    questionTitle.textContent = 'Данные загружаются...';
    formAnswers.innerHTML = `
      <img src="./img/spinner.gif" alt="Загрузка данных" title="Данные загружаются...">
    `;
    buttonPrev.classList.add('d-none');
    buttonNext.classList.add('d-none');

    firebase
      .database()
      .ref()
      .child('questions')
      .once('value')
      .then(snap => playTest(snap.val()));
  };

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
  const playTest = questions => {
    // Константа, хранящая промежуточный объект ответов
    // const answers = [];

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
        case indexQuestion === questions.length:
          buttonNext.classList.add('d-none');
          buttonSend.classList.remove('d-none');
          break;
        case indexQuestion === questions.length + 1:
          buttonPrev.classList.add('d-none');
          buttonSend.classList.add('d-none');
          break;
        default:
          buttonPrev.classList.remove('d-none');
          buttonNext.classList.remove('d-none');
          buttonSend.classList.add('d-none');
      }
    };

    // Функция рендеринга вопросов, ответов и кнопок
    const renderQuestions = indexQuestion => {
      formAnswers.textContent = '';

      switch (true) {
        case indexQuestion >= 0 && indexQuestion <= questions.length - 1:
          modalTitle.textContent = 'Ответьте на вопрос:';
          questionTitle.textContent = questions[indexQuestion].question;
          formAnswers.dataset.questionId = questions[indexQuestion].id;
          renderAnswers(indexQuestion);
          renderButtons(indexQuestion);
          break;
        case indexQuestion === questions.length:
          modalTitle.textContent = '';
          questionTitle.textContent = 'Тест завершен';
          formAnswers.dataset.questionId = 'n00';
          formAnswers.insertAdjacentHTML(
            'afterbegin',
            `
            <div class="form-group">
              <label for="n00a00">Введите номер телефона</label>
              <input type="phone" class="form-control" id="n00a00">
            </div>
            `
          );

          const numberPhone = document.getElementById('n00a00');

          numberPhone.addEventListener('input', event => {
            event.target.value = event.target.value.replace(/[^0-9+-]/, '');
          });

          renderButtons(indexQuestion);
          break;
        case indexQuestion === questions.length + 1:
          questionTitle.textContent = 'Спасибо!';
          formAnswers.textContent = 'Наш консультант свяжется с вами в течение 5 минут!';
          renderButtons(indexQuestion);
          break;
        default:
          console.log('Что-то пошло не так');
      }
    };

    // Функция проверки ответов на вопросы
    const checkAnswers = indexQuestion => {
      let questionId = '';
      let question = '';
      const answers = [];

      switch (true) {
        case indexQuestion >= 0 && indexQuestion <= questions.length - 1:
          questionId = questions[indexQuestion].id;
          question = questions[indexQuestion].question;
          break;
        case indexQuestion === questions.length:
          questionId = 'n00';
          question = 'Введите номер телефона';
          break;
        default:
          console.log('Что-то пошло не так');
      }

      const inputs = [...formAnswers.elements].filter(input => input.checked || input.id === 'n00a00');

      inputs.forEach((input, index) => {
        answers[index] = {
          id: input.id,
          title: input.value,
        };
      });

      finalAnswers[indexQuestion] = {
        id: questionId,
        question,
        answers,
      };

      console.log(finalAnswers);
    };

    const setAnswers = indexQuestion => {
      if (finalAnswers[indexQuestion]) {
        const inputs = [...formAnswers.elements];
        const inputsChecked = [];

        finalAnswers[indexQuestion].answers.forEach(answer => {
          inputsChecked.push(inputs.find(input => input.id === answer.id));
        });

        inputsChecked.forEach(inputChecked => (inputChecked.checked = 'true'));
      }
    };

    // Функция перехода к предыдущему вопросу
    const prevQuestion = () => {
      checkAnswers(numberQuestion);
      numberQuestion--;
      renderQuestions(numberQuestion);
      setAnswers(numberQuestion);
    };

    // Функия перехода к следующему вопросу
    const nextQuestion = () => {
      checkAnswers(numberQuestion);
      numberQuestion++;
      renderQuestions(numberQuestion);
      setAnswers(numberQuestion);
    };

    // Функциия отправки ответов на тест
    const sendAnswers = () => {
      checkAnswers(numberQuestion);
      numberQuestion++;
      renderQuestions(numberQuestion);

      firebase.database().ref().child('contacts').push(finalAnswers);

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
    getData();
  });

  // Обработчик открытия модального окна по клику на кнопку-бургер
  buttonBurger.addEventListener('click', () => {
    modalDialog.style.top = count + '%';
    requestAnimationFrame(animateModal);

    buttonBurger.classList.add('active');
    modalBlock.classList.add('d-block');
    getData();
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
