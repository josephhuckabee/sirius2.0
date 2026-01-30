const container = document.getElementById('space-news');
const sortSelect = document.getElementById('space-news-sort');
let currentItems = [];

const feeds = [
  { name: 'NASA', url: 'https://www.nasa.gov/news-release/feed/' },
  { name: 'ESA', url: 'https://www.esa.int/rssfeed/Our_Activities/Space_News' },
  { name: 'Space.com', url: 'https://www.space.com/feeds/all' }
];

const sortItems = (items, mode) => {
  const copy = [...items];
  switch (mode) {
    case 'date-asc':
      return copy.sort((a, b) => new Date(a.dateRaw) - new Date(b.dateRaw));
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'source':
      return copy.sort((a, b) => a.source.localeCompare(b.source));
    case 'date':
    default:
      return copy.sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));
  }
};

const render = (items) => {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<article class="grid-box"><p>News feed is temporarily unavailable. Please check back soon.</p></article>';
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <article class="grid-box">
          <p class="hover">${item.date}</p>
          <p>${item.title}</p>
          <a class="hover" href="${item.link}" target="_blank" rel="noopener">Source: ${item.source}</a>
        </article>
      `
    )
    .join('');
};

const fetchViaNetlify = async () => {
  const response = await fetch('/.netlify/functions/space-news');
  if (!response.ok) throw new Error('Netlify function unavailable');
  const data = await response.json();
  return (data.items || []).map((item) => ({
    title: item.title,
    link: item.link,
    source: item.source,
    date: item.date,
    dateRaw: item.dateRaw || item.date
  }));
};

const parseRSS = (xmlText, source) => {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item')).map((item) => {
    const title = item.querySelector('title')?.textContent?.trim() || 'Untitled';
    const link = item.querySelector('link')?.textContent?.trim() || '';
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
    const dateObj = pubDate ? new Date(pubDate) : null;
    return {
      title,
      link,
      source,
      date: dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date',
      dateRaw: dateObj ? dateObj.toISOString() : null
    };
  });

  return items.filter((item) => item.link);
};

const fetchViaProxy = async () => {
  const requests = feeds.map(async (feed) => {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) return [];
    const text = await response.text();
    return parseRSS(text, feed.name);
  });

  const results = await Promise.all(requests);
  return results.flat();
};

const loadNews = async () => {
  try {
    currentItems = await fetchViaNetlify();
  } catch (error) {
    try {
      currentItems = await fetchViaProxy();
    } catch (proxyError) {
      currentItems = [];
    }
  }

  if (!currentItems.length) {
    render([]);
    return;
  }

    const sorted = sortItems(currentItems, (sortSelect && sortSelect.value) || 'date');
    render(sorted);
};

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    render(sortItems(currentItems, sortSelect.value));
  });
}

loadNews();
