import i18next from 'i18next';
import resources from './locales';

const getI18n = (lng) => {
  const i18n = i18next.createInstance();
  return i18n.init({
    lng,
    resources,
  });
};

const renderInvalidUrl = (elements, initialState) => {
  const { rssImput, feedbackForm } = elements;
  const { validationUrl: { error } } = initialState;
  const i18n = getI18n(initialState.defaultLanguage);
  i18n.then((t) => {
    feedbackForm.innerHTML = '';
    rssImput.classList.add('is-invalid');
    feedbackForm.classList.remove('text-success');
    feedbackForm.classList.add('text-danger');
    feedbackForm.append(t(error));
  });
};

const renderValidUrl = (elements, initialState) => {
  const { rssImput, feedbackForm } = elements;
  const i18n = getI18n(initialState.defaultLanguage);
  i18n.then((t) => {
    feedbackForm.innerHTML = '';
    rssImput.classList.remove('is-invalid');
    feedbackForm.classList.remove('text-danger');
    feedbackForm.classList.add('text-success');
    feedbackForm.append(t('RSS_uploaded'));
    rssImput.value = '';
    rssImput.focus();
  });
};

const render = (elements, initialState) => (path, value) => {
  if (path === 'validationUrl.state' && value === 'invalid') {
    renderInvalidUrl(elements, initialState);
  }
  if (path === 'rssFeeds') {
    renderValidUrl(elements, initialState);
  }
};

export default render;
