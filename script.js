// Год в подвале
document.getElementById('year').textContent = new Date().getFullYear();

// Плавающая кнопка «Позвонить» на телефоне — показываем, когда первый экран прокручен
(function () {
  var bar = document.querySelector('.callbar');
  var hero = document.querySelector('.hero');
  if (!bar || !hero || !('IntersectionObserver' in window)) {
    if (bar) bar.classList.add('is-visible');
    return;
  }
  new IntersectionObserver(function (entries) {
    bar.classList.toggle('is-visible', !entries[0].isIntersecting);
  }, { threshold: 0.15 }).observe(hero);
})();
