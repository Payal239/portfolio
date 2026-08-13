(function () {
  var grid = document.getElementById('writing-grid');
  if (!grid) return;
  var handle = grid.getAttribute('data-medium-handle');
  if (!handle || handle === 'YOUR_MEDIUM_HANDLE') return; // keep static fallback cards

  var rssUrl = 'https://medium.com/feed/@' + handle;
  var apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);

  fetch(apiUrl)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data || data.status !== 'ok' || !data.items || !data.items.length) return;

      var posts = data.items.slice(0, 3);
      grid.innerHTML = posts.map(function (post) {
        var date = new Date(post.pubDate);
        var dateStr = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        var text = (post.description || '').replace(/<[^>]*>/g, '');
        var words = text.trim().split(/\s+/).length;
        var readMins = Math.max(1, Math.round(words / 200));
        var title = post.title || '';

        return '' +
          '<div class="article-card">' +
            '<div class="article-meta"><span>' + dateStr + '</span><span>' + readMins + ' min read</span></div>' +
            '<h3>' + title + '</h3>' +
            '<a href="' + post.link + '" class="article-read" target="_blank" rel="noopener">Read on Medium' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</a>' +
          '</div>';
      }).join('');
    })
    .catch(function () {
      // network/API hiccup — static fallback cards already in the DOM stay put
    });
})();
