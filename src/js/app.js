import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import i18next from 'i18next';
import resources from './locales';
import render from './view';
import parseRSS from './RSSparse';

yup.setLocale({
  string: {
    url: 'URL_invalid',
  },
});

const getAxiosResponse = (newUrl) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(newUrl)}`);

const validate = (existingURLs, newURL) => {
  const schemaValidationUrl = yup.string().url().notOneOf(existingURLs, 'existing_RSS').trim();
  return schemaValidationUrl.validate(newURL);
};

const initState = (defaultLanguage) => ({
  defaultLanguage,
  validationUrl: {
    state: 'valid',
    error: '',
  },
  content: {
    feeds: [],
    posts: [],
  },
  existingFeeds: [],
});

const getElements = () => ({
  rssForm: document.querySelector('.rss-form'),
  rssImput: document.querySelector('#url-input'),
  feedbackForm: document.querySelector('.feedback'),
  columnFeeds: document.querySelector('.feeds'),
  columnPosts: document.querySelector('.posts'),
});

const app = () => {
  const defaultLanguage = 'ru';
  const elements = getElements();
  const initialState = initState(defaultLanguage);
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  })
    .then(() => {
      const watcherState = onChange(initialState, render(elements, initialState, i18n));
      elements.rssForm.addEventListener('submit', (e) => {
        e.preventDefault();
        watcherState.validationUrl.state = 'updated';
        const formData = new FormData(e.target);
        const existingURLs = watcherState.content.feeds.map((feed) => feed.url);
        validate(existingURLs, formData.get('url'))
          .then((newUrl) => getAxiosResponse(newUrl))
          .then((response) => {
            const parser = new DOMParser();
            const responseDom = parser.parseFromString(response.data.contents, 'text/xml');
            if (responseDom.querySelector('parsererror')) throw new Error('invalid_RSS');
            const data = parseRSS(responseDom);
            const { url } = response.data.status;
            const feedId = Number(uniqueId());
            data.feed.url = url;
            data.feed.feedId = feedId;
            data.posts = data.posts.map((post) => ({
              ...post,
              feedId,
              postId: Number(uniqueId()),
            }));
            watcherState.content.feeds.push(data.feed);
            watcherState.content.posts = [...data.posts, ...watcherState.content.posts];
            // updateFeeds(watcherState);
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
    });
};

export default app;
