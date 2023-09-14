import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import render from './view';
import parseRSS from './RSSparse';

yup.setLocale({
  string: {
    url: 'URL_invalid',
  },
});

const initState = (defaultLanguage) => ({
  defaultLanguage,
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
  const defaultLanguage = 'ru';
  const elements = getElements();
  const initialState = initState(defaultLanguage);
  const watcherState = onChange(initialState, render(elements, initialState));
  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    watcherState.validationUrl.state = 'updated';
    const formData = new FormData(e.target);
    const schemaValidationUrl = yup.string().url().notOneOf(initialState.rssFeeds, 'existing_RSS').trim();
    schemaValidationUrl.validate(formData.get('url'))
      .then((newUrl) => {
        axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(newUrl)}`)
          .then((response) => {
            const parser = new DOMParser();
            const responseDom = parser.parseFromString(response.data.contents, 'text/xml');
            if (responseDom.querySelector('parsererror')) throw new Error('invalid_RSS');
            parseRSS(responseDom);
          })
          .catch((err) => {
            watcherState.validationUrl.error = err.message;
            watcherState.validationUrl.state = 'invalid';
          });
        watcherState.rssFeeds.push(newUrl);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          watcherState.validationUrl.error = err.message;
          watcherState.validationUrl.state = 'invalid';
        } else {
          console.log('Выпала неизвесная ошибка:');
          console.dir(err);
        }
      });
  });
};

export default app;
