(function() {
  try {
    var pageName = window.location.pathname.split('/').pop() || 'index.html';
    if (pageName === '') pageName = 'index.html';

    var pageKey = 'bday_vcount_' + pageName;
    var totalKey = 'bday_total_visits';

    var pageVisits = parseInt(localStorage.getItem(pageKey) || '0', 10) + 1;
    var totalVisits = parseInt(localStorage.getItem(totalKey) || '0', 10) + 1;

    localStorage.setItem(pageKey, pageVisits.toString());
    localStorage.setItem(totalKey, totalVisits.toString());

    var payload = {
      page: pageName,
      title: document.title,
      visitCount: pageVisits,
      totalVisits: totalVisits,
      screen: window.innerWidth + 'x' + window.innerHeight,
      referrer: document.referrer || 'Direct'
    };

    var trackUrl = '/api/track';
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackUrl, JSON.stringify(payload));
    } else {
      fetch(trackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function() {});
    }
  } catch(e) {}
})();
