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
  const posts = [];
  const items = dom.querySelectorAll('item');
  items.forEach((item) => posts.push({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));
  return posts;
};

const parseRSS = (data) => {
  const newData = {
    feed: {},
    posts: [],
  };
  const parser = new DOMParser();
  const responseDom = parser.parseFromString(data, 'text/xml');
  if (responseDom.querySelector('parsererror')) throw new ValidationRSSError('invalid_RSS');
  newData.feed = getFeed(responseDom);
  newData.posts = getPosts(responseDom);
  return newData;
};

export default parseRSS;
