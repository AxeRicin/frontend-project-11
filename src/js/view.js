const renderDisableButton = (elements) => {
  const { rssButton } = elements;
  rssButton.disabled = true;
  rssButton.setAttribute('disabled', 'disabled');
};

const renderInvalidUrl = (elements, initialState, i18n) => {
  const { rssImput, rssButton, feedbackForm } = elements;
  const { validationUrl: { error } } = initialState;

  feedbackForm.innerHTML = '';
  rssImput.classList.add('is-invalid');
  feedbackForm.classList.remove('text-success');
  feedbackForm.classList.add('text-danger');
  feedbackForm.append(i18n.t(error));
  rssButton.removeAttribute('disabled');
};

const renderValidUrl = (elements, initialState, i18n) => {
  const { rssButton, rssImput, feedbackForm } = elements;
  feedbackForm.innerHTML = '';
  rssImput.classList.remove('is-invalid');
  feedbackForm.classList.remove('text-danger');
  feedbackForm.classList.add('text-success');
  feedbackForm.append(i18n.t('RSS_uploaded'));
  rssImput.value = '';
  rssImput.focus();
  rssButton.removeAttribute('disabled');
};

const initColumnLists = (columnFeeds, i18n) => {
  const feedConteiner = document.createElement('div');
  feedConteiner.classList.add('card', 'border-0');
  const titelConteiner = document.createElement('div');
  titelConteiner.classList.add('card-body');
  feedConteiner.append(titelConteiner);
  const titleGeneral = document.createElement('h2');
  titleGeneral.classList.add('card-title', 'h4');
  titleGeneral.textContent = i18n.t('title_feeds');
  titelConteiner.append(titleGeneral);
  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  feedConteiner.append(feedList);
  columnFeeds.append(feedConteiner);
};

const renderFeeds = (elements, feeds, i18n) => {
  const { columnFeeds } = elements;
  if (columnFeeds.childNodes.length === 0) {
    initColumnLists(columnFeeds, i18n);
  }
  const feedList = columnFeeds.querySelector('ul');
  feedList.innerHTML = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.titleFeed;
    li.append(title);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.descriptionFeed;
    li.append(p);
    feedList.append(li);
  });
};

const initColumnPosts = (columnPosts, i18n) => {
  const conteiner = document.createElement('div');
  conteiner.classList.add('card', 'border-0');
  const titleConteiner = document.createElement('div');
  titleConteiner.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18n.t('posts');
  titleConteiner.append(title);
  conteiner.append(titleConteiner);
  const postLists = document.createElement('ul');
  postLists.classList.add('list-group', 'border-0', 'rounded-0');
  conteiner.append(postLists);
  columnPosts.append(conteiner);
};

const renderPosts = (elements, posts, i18n) => {
  const { columnPosts } = elements;
  if (columnPosts.childNodes.length === 0) {
    initColumnPosts(columnPosts, i18n);
  }
  const postLists = columnPosts.querySelector('ul');
  postLists.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const title = document.createElement('a');
    title.classList.add('fw-bold');
    title.textContent = post.title;
    title.href = post.link;
    title.setAttribute('data-id', post.postId);
    li.append(title);
    postLists.append(li);
  });
};

const render = (elements, initialState, i18n) => (path, value) => {
  // console.log(path, value);
  if (path === 'validationUrl.state' && value === 'updated') {
    renderDisableButton(elements);
  }
  if (path === 'validationUrl.state' && value === 'invalid') {
    renderInvalidUrl(elements, initialState, i18n);
  }
  if (path === 'validationUrl.state' && value === 'valid') {
    renderValidUrl(elements, initialState, i18n);
  }
  if (path === 'content.feeds') {
    renderFeeds(elements, value, i18n);
  }
  if (path === 'content.posts') {
    renderPosts(elements, value, i18n);
  }
};

export default render;
