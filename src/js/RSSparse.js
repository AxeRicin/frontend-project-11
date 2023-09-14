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
  }));
  return posts;
};

const parseRSS = (dom) => {
  const result = {
    feed: {},
    posts: [],
  };
  result.feed = getFeed(dom);
  result.posts = getPosts(dom);
  return result;
};

export default parseRSS;
