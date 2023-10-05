import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import i18next from 'i18next';
import resources from './locales';
import render from './view';
import parseRSS from './parseRSS';

const getURLForRequest = (newUrl) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.append('disableCache', 'true');
  url.searchParams.append('url', newUrl);
  return url;
};

const getAxiosResponse = (newUrl) => {
  const url = getURLForRequest(newUrl);
  return axios.get(url.href);
};

const validate = (existingURLs, newURL) => {
  const schemaValidationUrl = yup.string().url().notOneOf(existingURLs, 'existing_RSS').trim();
  return schemaValidationUrl.validate(newURL);
};

const getNewPosts = (receivedPosts, oldPosts) => {
  const oldLinks = oldPosts.map((post) => post.link);
  const newPosts = receivedPosts.filter((post) => !oldLinks.includes(post.link));
  return newPosts;
};

const updateFeeds = (watcherState) => {
  const promises = watcherState.content.feeds.map((feed) => getAxiosResponse(feed.url)
    .then((response) => {
      const data = parseRSS(response.data.contents);
      const newPosts = getNewPosts(data.posts, watcherState.content.posts)
        .map((post) => ({
          ...post,
          feedId: feed.feedId,
          postId: uniqueId(),
        }));

      if (newPosts.length > 0) watcherState.content.posts.unshift(...newPosts);
    }));
  Promise.allSettled(promises)
    .then(() => setTimeout(updateFeeds, 5000, watcherState));
};

const findPostById = (posts, id) => posts.find((post) => post.postId === id);

const fillingModalWindow = (watcherState, posts, button) => {
  const postId = button.dataset.id;
  const post = findPostById(posts, postId);
  if (!watcherState.readPosts.includes(postId)) watcherState.readPosts.push(postId);
  watcherState.modal.post = post;
  watcherState.modal.state = 'show';
};

const closeModal = (watcherState) => {
  watcherState.modal.post = null;
  watcherState.modal.state = 'hide';
};

const app = () => {
  const elements = {
    rssForm: document.querySelector('.rss-form'),
    rssInput: document.querySelector('#url-input'),
    rssButton: document.querySelector('.rss-form button'),
    feedbackForm: document.querySelector('.feedback'),
    columnFeeds: document.querySelector('.feeds'),
    columnPosts: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('#modal .modal-title'),
    modalBody: document.querySelector('#modal .modal-body'),
    modalLink: document.querySelector('#modal .modal-footer a'),
  };
  const defaultLanguage = 'ru';
  const initialState = {
    defaultLanguage,
    validationUrl: {
      state: 'valid',
      error: null,
    },
    content: {
      feeds: [],
      posts: [],
    },
    readPosts: [],
    modal: {
      post: null,
    },
  };
  yup.setLocale({
    string: {
      url: 'URL_invalid',
    },
  });
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  })
    .then(() => {
      const watcherState = onChange(initialState, render(elements, initialState, i18n));
      updateFeeds(watcherState);
      elements.rssForm.addEventListener('submit', (e) => {
        e.preventDefault();
        watcherState.validationUrl.state = 'updated';
        const formData = new FormData(e.target);
        const existingURLs = watcherState.content.feeds.map((feed) => feed.url);
        const currentURL = formData.get('url');
        validate(existingURLs, currentURL)
          .then((newUrl) => getAxiosResponse(newUrl))
          .then((response) => {
            const data = parseRSS(response.data.contents);
            const feedId = uniqueId();
            data.feed.url = currentURL;
            data.feed.feedId = feedId;
            data.posts = data.posts.map((post) => ({
              ...post,
              feedId,
              postId: uniqueId(),
            }));
            watcherState.content.feeds.push(data.feed);
            watcherState.content.posts = [...data.posts, ...watcherState.content.posts];
            watcherState.validationUrl.state = 'valid';
          })
          .catch((err) => {
            switch (err.name) {
              case 'ValidationError':
              case 'ValidationRSSError':
                watcherState.validationUrl.error = err.message;
                watcherState.validationUrl.state = 'invalid';
                break;
              case 'AxiosError':
                watcherState.validationUrl.error = err.code;
                watcherState.validationUrl.state = 'invalid';
                break;

              default:
                console.log('Выпала неизвесная ошибка:');
                console.dir(err);
                break;
            }
          });
      });
      elements.columnPosts.addEventListener('click', (e) => {
        const targetId = e.target.dataset.id;
        if (targetId && !watcherState.readPosts.includes(targetId)) {
          watcherState.readPosts.push(targetId);
        }
      });
      elements.modal.addEventListener('show.bs.modal', (event) => fillingModalWindow(watcherState, initialState.content.posts, event.relatedTarget));
      elements.modal.addEventListener('hide.bs.modal', () => closeModal(watcherState));
    });
};

export default app;
