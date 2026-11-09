(function () {
  var OPEN_ON_RUN = true;
  var AUTOPLAY_MS = 0;
  var BASE = 'https:' + '/' + '/raw.githubusercontent.com/Raybilon/gallery-crescent-grove/main/';
  var FILES = [
    'Active Amenity 3-compressed.jpg',
    'Active Amenity-compressed.jpg',
    'Amenity Admin 2-compressed.jpg',
    'Amenity Admin 3-compressed.jpg',
    'Amenity Admin-compressed.jpg',
    'Amenity Clubhouse-compressed.jpg',
    'Amenity Nighttime 2-compressed.jpg',
    'Amenity Nighttime-compressed.jpg',
    'Amenity Social Hall-compressed.jpg',
    'Amenity from Entrance-compressed.jpg',
    'Amenity-compressed.jpg'
  ];

  if (window.CGGallery && window.CGGallery.built) {
    if (OPEN_ON_RUN) { window.CGGallery.open(0); }
    return;
  }

  var IMAGES = [];
  for (var k = 0; k < FILES.length; k++) { IMAGES.push(BASE + encodeURIComponent(FILES[k])); }
  var index = 0, timer = null, root = null, imgEl = null, counterEl = null, loaderEl = null;

  var css = [
    '.cgo{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.65);font-family:Georgia,serif;opacity:0;transition:opacity .25s ease}',
    '.cgo.cgshow{display:flex}',
    '.cgo.cgin{opacity:1}',
    '.cgstage{position:relative;width:76vw;height:78vh;display:flex;align-items:center;justify-content:center;background:#0b0f0b;box-shadow:0 10px 50px rgba(0,0,0,.6)}',
    '.cgimg{width:76vw;height:78vh;object-fit:contain;display:block;transition:opacity .3s ease;user-select:none}',
    '.cgimg.cgfade{opacity:0}',
    '.cgbtn{box-sizing:border-box;position:absolute;background:none;border:0;cursor:pointer;color:#fff;padding:12px;line-height:0;opacity:.9;transition:transform .15s ease}',
    '.cgbtn:hover{opacity:1;transform:scale(1.12)}',
    '.cgbtn svg{width:inherit;height:inherit;display:block}',
    '.cgprev,.cgnext{top:50vh;width:56px;height:80px;margin-top:-40px}',
    '.cgprev{left:calc(12vw - 62px)}',
    '.cgnext{right:calc(12vw - 62px)}',
    '.cgclose{top:14px;right:18px;width:48px;height:48px}',
    '.cgcount{position:absolute;left:0;right:0;bottom:-34px;text-align:center;color:#fff;font-size:15px;letter-spacing:2px}',
    '.cgload{position:absolute;width:42px;height:42px;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:21px;animation:cgspin .8s linear infinite;display:none}',
    '@keyframes cgspin{to{transform:rotate(360deg)}}',
    '@media (max-width:800px){.cgstage,.cgimg{width:96vw;height:60vh}.cgprev{left:0;width:42px;height:64px}.cgnext{right:0;width:42px;height:64px}.cgclose{top:6px;right:6px}}'
  ].join(' ');

  var SVGA = "<svg viewBox='0 0 40 80' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>";
  var ARROW_L = SVGA + "<polyline points='32,6 8,40 32,74'/></svg>";
  var ARROW_R = SVGA + "<polyline points='8,6 32,40 8,74'/></svg>";
  var X_ICON = "<svg viewBox='0 0 40 40' fill='none' stroke='currentColor' stroke-width='5' stroke-linecap='round'><line x1='6' y1='6' x2='34' y2='34'/><line x1='34' y1='6' x2='6' y2='34'/></svg>";

  function mk(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (html) { e.innerHTML = html; }
    return e;
  }

  function build() {
    if (root) { return; }
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    root = mk('div', 'cgo');
    var bClose = mk('button', 'cgbtn cgclose', X_ICON);
    var bPrev = mk('button', 'cgbtn cgprev', ARROW_L);
    var bNext = mk('button', 'cgbtn cgnext', ARROW_R);
    var stage = mk('div', 'cgstage');
    loaderEl = mk('div', 'cgload');
    imgEl = mk('img', 'cgimg');
    counterEl = mk('div', 'cgcount');
    stage.appendChild(loaderEl);
    stage.appendChild(imgEl);
    stage.appendChild(counterEl);
    root.appendChild(bClose);
    root.appendChild(bPrev);
    root.appendChild(stage);
    root.appendChild(bNext);
    document.body.appendChild(root);

    bClose.addEventListener('click', close);
    bPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
    bNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });
    root.addEventListener('click', function (e) { if (e.target === root) { close(); } });

    var sx = null;
    root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (sx === null) { return; }
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { if (dx < 0) { next(); } else { prev(); } }
      sx = null;
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) { return; }
      if (e.key === 'ArrowRight') { next(); }
      else if (e.key === 'ArrowLeft') { prev(); }
      else if (e.key === 'Escape') { close(); }
    });
  }

  function isOpen() { return root && root.classList.contains('cgshow'); }

  function wrap(n) {
    if (n >= IMAGES.length) { return 0; }
    if (n < 0) { return IMAGES.length - 1; }
    return n;
  }

  function show(i) {
    index = wrap(i);
    imgEl.classList.add('cgfade');
    loaderEl.style.display = 'block';
    var src = IMAGES[index];
    var pre = new Image();
    var done = function () {
      if (IMAGES[index] !== src) { return; }
      imgEl.src = src;
      imgEl.classList.remove('cgfade');
      loaderEl.style.display = 'none';
      (new Image()).src = IMAGES[wrap(index + 1)];
      (new Image()).src = IMAGES[wrap(index - 1)];
    };
    pre.onload = done;
    pre.onerror = done;
    pre.src = src;
    counterEl.textContent = (index + 1) + ' / ' + IMAGES.length;
  }

  function next() { show(index + 1); restart(); }
  function prev() { show(index - 1); restart(); }

  function restart() {
    clearInterval(timer);
    if (AUTOPLAY_MS > 0 && isOpen()) { timer = setInterval(function () { show(index + 1); }, AUTOPLAY_MS); }
  }

  function open(start) {
    build();
    root.classList.add('cgshow');
    setTimeout(function () { root.classList.add('cgin'); }, 20);
    show(typeof start === 'number' ? start : 0);
    restart();
  }

  function close() {
    if (!root) { return; }
    clearInterval(timer);
    root.classList.remove('cgin');
    setTimeout(function () { root.classList.remove('cgshow'); }, 250);
  }

  window.CGGallery = { open: open, close: close, next: next, prev: prev, built: true };
  if (OPEN_ON_RUN) { open(0); }
})();