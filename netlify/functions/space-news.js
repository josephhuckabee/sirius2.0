const RSSParser = require('rss-parser');

const parser = new RSSParser();

const feeds = [
  {
    name: 'NASA',
    url: 'https://www.nasa.gov/news-release/feed/'
  },
  {
    name: 'ESA',
    url: 'https://www.esa.int/rssfeed/Our_Activities/Space_News'
  },
  {
    name: 'Space.com',
    url: 'https://www.space.com/feeds/all'
  }
];

const formatDate = (date) => {
  if (!date || Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

exports.handler = async () => {
  const items = [];

  await Promise.all(
    feeds.map(async (feed) => {
      try {
        const result = await parser.parseURL(feed.url);
        result.items.forEach((item) => {
          const date = new Date(item.isoDate || item.pubDate || item.published || item.updated);
          items.push({
            title: item.title || 'Untitled',
            link: item.link || feed.url,
            date,
            source: feed.name
          });
        });
      } catch (error) {
        return null;
      }
    })
  );

  const payload = items
    .filter((item) => item && item.title && item.link)
    .sort((a, b) => b.date - a.date)
    .map((item) => ({
      title: item.title,
      link: item.link,
      source: item.source,
      date: formatDate(item.date),
      dateRaw: item.date ? item.date.toISOString() : null
    }));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=0, s-maxage=900'
    },
    body: JSON.stringify({ items: payload })
  };
};
