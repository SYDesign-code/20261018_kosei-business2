/* 株式会社コーセイ コーポレートサイト スクリプト(依存ライブラリなし) */
(function () {
  'use strict';

  /* ---------- メニュー(ドロワー) ---------- */
  var panel = document.getElementById('nav-panel');
  var openBtn = document.querySelector('[data-menu-open]');
  var closeBtn = document.querySelector('[data-menu-close]');
  var lastFocus = null;

  function openMenu() {
    if (!panel) return;
    lastFocus = document.activeElement;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu() {
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (panel) {
    panel.addEventListener('click', function (e) { if (e.target === panel) closeMenu(); });
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel && panel.classList.contains('is-open')) closeMenu();
  });

  /* ---------- スクロールで、ふわっと表示 ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 「選ばれる理由」カルーセル ---------- */
  var track = document.querySelector('[data-carousel]');
  if (track) {
    var step = function () {
      var card = track.querySelector('.reason');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };
    var prev = document.querySelector('[data-carousel-prev]');
    var next = document.querySelector('[data-carousel-next]');
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    /* 初期表示は中央のカードに合わせる */
    var cards = track.querySelectorAll('.reason');
    if (cards.length) {
      var mid = cards[Math.floor(cards.length / 2)];
      track.scrollLeft = mid.offsetLeft - (track.clientWidth - mid.offsetWidth) / 2;
    }
  }

  /* ---------- お問い合わせフォーム(入力チェック) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var done = document.getElementById('form-done');
    var rules = {
      name: { required: true, msg: 'お名前を入力してください。' },
      email: { required: true, type: 'email', msg: 'メールアドレスを正しく入力してください。' },
      tel: { required: false, type: 'tel', msg: '電話番号は数字とハイフンで入力してください。' },
      kind: { required: true, msg: 'お問い合わせの種類を選んでください。' },
      message: { required: true, msg: 'お問い合わせ内容を入力してください。' },
      agree: { required: true, msg: '個人情報の取り扱いへの同意が必要です。' }
    };
    function check(name) {
      var r = rules[name]; var el = form.elements[name]; if (!r || !el) return true;
      var ok = true;
      var v = el.type === 'checkbox' ? el.checked : String(el.value || '').trim();
      if (r.required && !v) ok = false;
      if (ok && v && r.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ok = false;
      if (ok && v && r.type === 'tel' && !/^[0-9+\-() ]{9,15}$/.test(v)) ok = false;
      var box = el.closest('.field, .check'); var err = form.querySelector('[data-error-for="' + name + '"]');
      if (box) box.classList.toggle('has-error', !ok);
      if (err) err.textContent = ok ? '' : r.msg;
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }
    Object.keys(rules).forEach(function (n) {
      var el = form.elements[n]; if (!el) return;
      el.addEventListener('blur', function () { check(n); });
      el.addEventListener('change', function () { check(n); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (n) { if (!check(n) && !firstBad) firstBad = form.elements[n]; });
      if (firstBad) { firstBad.focus(); return; }
      /* TODO(公開時に設定): ここで送信先(メールフォームサービス/サーバー側の受信処理)に
         fetch または form.submit() で送信してください。 */
      if (done) { done.classList.add('is-show'); done.focus(); }
      form.reset();
    });
  }
})();
