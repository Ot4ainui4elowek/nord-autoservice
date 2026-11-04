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
