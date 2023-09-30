import ValidationRSSError from './ValidationRSSError';

const getFeed = (dom) => {
  const titleFeed = dom.querySelector('channel>title').textContent;
  const descriptionFeed = dom.querySelector('channel>description').textContent;
  return {
    titleFeed,
    descriptionFeed,
  };
};

const getPosts = (dom) => {
  const items = dom.querySelectorAll('item');
  return Array.from(items).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));
};

const parseRSS = (data) => {
  const parser = new DOMParser();
  const responseDom = parser.parseFromString(data, 'text/xml');
  if (responseDom.querySelector('parsererror')) throw new ValidationRSSError('invalid_RSS');
  return {
    feed: getFeed(responseDom),
    posts: getPosts(responseDom),
  };
};

export default parseRSS;
