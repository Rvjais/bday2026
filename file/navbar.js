
(function() {
  var PAGES = [
    { id: 1, name: 'Blossom', icon: '🌸', file: 'index.html' },
    { id: 2, name: 'Music', icon: '🎵', file: 'music.html' },
    { id: 3, name: 'Wishes', icon: '💖', file: 'birthday.html' },
    { id: 4, name: 'Arcade', icon: '🎮', file: 'games.html' }
  ];

  // Determine current page ID accurately on local and Vercel clean URLs
  var pathName = window.location.pathname.toLowerCase();
  var href = window.location.href.toLowerCase();
  var currentPageId = 1;

  if (pathName.includes('game') || pathName.includes('arcade') || href.includes('games')) {
    currentPageId = 4;
  } else if (pathName.includes('birth') || pathName.includes('wish') || href.includes('birthday')) {
    currentPageId = 3;
  } else if (pathName.includes('music') || pathName.includes('song') || href.includes('music')) {
    currentPageId = 2;
  } else {
    currentPageId = 1;
  }

  // Manage Unlock Progress in localStorage
  var allUnlocked = localStorage.getItem('bday_all_unlocked') === 'true';
  var unlockedLevel = parseInt(localStorage.getItem('bday_unlocked_level') || '1', 10);

  // If user reached current page, update unlocked level
  if (currentPageId > unlockedLevel) {
    unlockedLevel = currentPageId;
    localStorage.setItem('bday_unlocked_level', unlockedLevel.toString());
  }
  if (currentPageId === 4 || unlockedLevel >= 4) {
    allUnlocked = true;
    localStorage.setItem('bday_all_unlocked', 'true');
  }

  // Helper to resolve clean URLs across Vercel and local static files
  function resolvePageUrl(file) {
    // If running inside /happybday/ folder
    if (window.location.pathname.includes('/happybday')) {
      return '/happybday/' + file;
    }
    return file;
  }

  // Inject Navbar HTML & Toast into DOM
  function initNavbar() {
    if (document.querySelector('.bday-navbar')) return;

    var spacer = document.createElement('div');
    spacer.className = 'bday-navbar-spacer';
    document.body.appendChild(spacer);

    var toast = document.createElement('div');
    toast.className = 'bday-nav-toast';
    toast.id = 'bday-nav-toast';
    document.body.appendChild(toast);

    var nav = document.createElement('nav');
    nav.className = 'bday-navbar';

    PAGES.forEach(function(page) {
      var isUnlocked = allUnlocked || page.id <= unlockedLevel;
      var isActive = page.id === currentPageId;

      var item = document.createElement('a');
      item.className = 'bday-nav-item' + (isActive ? ' active' : '') + (!isUnlocked ? ' locked' : '');
      item.href = isUnlocked ? resolvePageUrl(page.file) : 'javascript:void(0);';

      var iconHtml = '<span class="bday-nav-icon">' + page.icon + '</span>';
      var labelHtml = '<span class="bday-nav-label">' + page.name + '</span>';
      var lockHtml = !isUnlocked ? '<span class="bday-nav-lock">🔒</span>' : '';

      item.innerHTML = iconHtml + labelHtml + lockHtml;

      if (!isUnlocked) {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          showToast('✨ Keep exploring to unlock ' + page.name + '! 💕');
        });
      }

      nav.appendChild(item);
    });

    document.body.appendChild(nav);
  }

  var toastTimer = null;
  function showToast(msg) {
    var toast = document.getElementById('bday-nav-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
