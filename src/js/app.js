import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';

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
    const schemaValidationUrl = yup.string().url().trim().notOneOf(initialState.rssFeeds, 'existing_RSS');
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

export default app;
