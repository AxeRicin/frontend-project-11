import '../scss/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';

const initState = () => ({
  validationUrl: {
    state: 'valid',
    error: '',
  },
  rssFeeds: [],
});

const getElements = () => ({
  rssForm: document.querySelector('.rss-form'),
  rssImput: document.querySelector('#url-input'),
  feedbackForm: document.querySelector('.feedback'),
});

const app = () => {
  const elements = getElements();
  const initialState = initState();
  const watcherState = onChange(initialState, render(elements, initialState));
  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    watcherState.validationUrl.state = 'updated';
    const formData = new FormData(e.target);
    const schemaValidationUrl = yup.string().url('Ссылка должна быть валидным URL').trim().notOneOf(initialState.rssFeeds, 'RSS уже существует');
    schemaValidationUrl.validate(formData.get('url'))
      .then((newUrl) => watcherState.rssFeeds.push(newUrl))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          watcherState.validationUrl.error = err.message;
          watcherState.validationUrl.state = 'invalid';
        }
      });
  });
};

app();
