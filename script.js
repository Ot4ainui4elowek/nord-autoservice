// Год в подвале
document.getElementById('year').textContent = new Date().getFullYear();

// Статус «Открыто / Закрыто» по времени Тирасполя. Пн–Сб 9:30–18:00.
(function () {
  var el = document.getElementById('status');
  if (!el || !window.Intl) return;
  var OPEN = 9 * 60 + 30, CLOSE = 18 * 60;
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var parts;
  try {
    parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Chisinau', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
  } catch (e) { return; }
  var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
  var day = days.indexOf(get('weekday'));
  var now = (+get('hour') % 24) * 60 + (+get('minute'));
  var workday = function (d) { return d >= 1 && d <= 6; };

  var text, open = false;
  if (workday(day) && now >= OPEN && now < CLOSE) { open = true; text = 'Сейчас открыто, до 18:00'; }
  else if (workday(day) && now < OPEN) { text = 'Сегодня откроемся в 9:30'; }
  else if (workday((day + 1) % 7)) { text = 'Закрыто, откроемся завтра в 9:30'; }
  else { text = 'Закрыто, откроемся в понедельник в 9:30'; }

  el.querySelector('.status__text').textContent = text;
  el.classList.toggle('is-open', open);
  el.hidden = false;
})();

// Плавающая кнопка «Позвонить» на телефоне — появляется, когда первый экран прокручен
(function () {
  var bar = document.querySelector('.callbar');
  var hero = document.querySelector('.hero');
  if (!bar || !hero) return;
  if (!('IntersectionObserver' in window)) { bar.classList.add('is-visible'); return; }
  new IntersectionObserver(function (entries) {
    bar.classList.toggle('is-visible', !entries[0].isIntersecting);
  }, { threshold: 0.1 }).observe(hero);
})();

// Услуги на телефоне: тап по карточке раскрывает описание
(function () {
  var mq = window.matchMedia('(max-width: 640px)');
  document.querySelectorAll('.service:not(.service--cta)').forEach(function (item) {
    var sync = function () {
      if (mq.matches) {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
      } else {
        item.removeAttribute('role');
        item.removeAttribute('tabindex');
        item.removeAttribute('aria-expanded');
      }
    };
    var toggle = function () { if (!mq.matches) return; item.classList.toggle('is-open'); sync(); };
    item.addEventListener('click', toggle);
    item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
  });
})();

// Тень у шапки при прокрутке
(function () {
  var bar = document.querySelector('.topbar');
  if (!bar) return;
  var on = function () { bar.classList.toggle('is-scrolled', window.scrollY > 8); };
  on();
  window.addEventListener('scroll', on, { passive: true });
})();

// Анимации появления: заголовки по словам, телефон по цифрам, блоки снизу вверх
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function split(el, byChar) {
    var text = el.textContent.trim();
    var parts = byChar ? Array.from(text) : text.split(' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    parts.forEach(function (part, i) {
      var w = document.createElement('span');
      var inner = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      inner.textContent = part === ' ' ? ' ' : part;
      inner.style.setProperty('--i', i);
      w.appendChild(inner);
      el.appendChild(w);
      if (!byChar && i < parts.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('split');
  }

  document.querySelectorAll('.block__head h2, .master h2, .contacts h2').forEach(function (h) { split(h, false); });
  var phone = document.querySelector('.contacts__phone');
  if (phone) split(phone, true);

  var groups = [
    ['.block__head p', false],
    ['.service', true],
    ['.master__role, .master__copy > p:not(.master__role)', true],
    ['.checks li', true],
    ['.master__media', false],
    ['.route__map, .route__card', true],
    ['.landmarks li', true],
    ['.faq__item', true],
    ['.contacts__actions, .contacts__info > div', true]
  ];
  var targets = [];
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, i) {
      el.classList.add('rv');
      if (g[1]) el.style.setProperty('--i', i % 4);
      targets.push(el);
    });
  });
  document.querySelectorAll('.split').forEach(function (el) { targets.push(el); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
