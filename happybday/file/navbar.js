
(function() {
  var PAGES = [
    { id: 1, name: 'Blossom', icon: '🌸', url: 'index.html' },
    { id: 2, name: 'Music', icon: '🎵', url: 'music.html' },
    { id: 3, name: 'Wishes', icon: '💖', url: 'birthday.html' },
    { id: 4, name: 'Arcade', icon: '🎮', url: 'games.html' }
  ];

  // Determine current page ID
  var pathName = window.location.pathname.toLowerCase();
  var currentPageId = 1;
  if (pathName.indexOf('music.html') !== -1) currentPageId = 2;
  else if (pathName.indexOf('birthday.html') !== -1) currentPageId = 3;
  else if (pathName.indexOf('games.html') !== -1) currentPageId = 4;

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
      item.href = isUnlocked ? page.url : 'javascript:void(0);';

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
