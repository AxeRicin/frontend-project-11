const renderInvalidUrl = (elements, initialState) => {
  const { rssImput, feedbackForm } = elements;
  const { validationUrl: { error } } = initialState;
  feedbackForm.innerHTML = '';
  rssImput.classList.add('is-invalid');
  feedbackForm.classList.remove('text-success');
  feedbackForm.classList.add('text-danger');
  feedbackForm.append(error);
};

const renderValidUrl = (elements) => {
  const { rssImput, feedbackForm } = elements;
  feedbackForm.innerHTML = '';
  rssImput.classList.remove('is-invalid');
  feedbackForm.classList.remove('text-danger');
  feedbackForm.classList.add('text-success');
  feedbackForm.append('RSS Успешно загружен');
  rssImput.value = '';
  rssImput.focus();
};

const render = (elements, initialState) => (path, value) => {
  if (path === 'validationUrl.state' && value === 'invalid') {
    renderInvalidUrl(elements, initialState);
  }
  if (path === 'rssFeeds') {
    renderValidUrl(elements);
  }
};

export default render;
