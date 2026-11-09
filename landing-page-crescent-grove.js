(function () {
  var OPEN_ON_RUN = true;
  var BASE = 'https:' + '/' + '/raw.githubusercontent.com/Raybilon/gallery-crescent-grove/main/';
  var BG_URL = BASE + encodeURIComponent('CGV Greenview FA-compressed.jpg');
  var LOGO_URL = BASE + encodeURIComponent('Crescent Grove logo colored.png');
  var ALP_URL = BASE + encodeURIComponent('Image_4939E77A_6C6E_DA87_41D1_10BF4CA93303_en.png');

  var TEXT_1 = 'Crescent Grove is Ayala Land Premier newest residential enclave in Vermosa, a master planned and sustainable estate in the south.';
  var TEXT_2 = 'Nestled within gently rolling landscapes and interwoven with lush greenways, Crescent Grove presents a living experience that is closely tied to nature.';
  var BUTTON_TEXT = 'Discover Crescent Grove >';

  if (window.CGLanding && window.CGLanding.built) {
    if (OPEN_ON_RUN) { window.CGLanding.open(); }
    return;
  }

  var root = null;

  var css = [
    '.cgl{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483100;display:none;overflow:hidden;background:#1d3a2a;opacity:0;transition:opacity .6s ease;font-family:Calibri,Candara,Segoe UI,Arial,sans-serif}',
    '.cgl.cglshow{display:block}',
    '.cgl.cglin{opacity:1}',
    '.cglbg{position:absolute;top:0;left:0;width:100vw;height:100vh;object-fit:cover;display:block}',
    '.cglfade{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to right,rgba(255,255,255,.95) 0,rgba(255,255,255,.8) 18vw,rgba(255,255,255,.35) 38vw,rgba(255,255,255,0) 62vw)}',
    '.cglalp{position:absolute;top:3vh;right:2vw;width:max(150px,19vw);height:auto;display:block}',
    '.cglbox{position:absolute;left:8vw;top:13vh;width:32vw;opacity:0;transform:translateY(20px);transition:opacity .9s ease .3s,transform .9s ease .3s}',
    '.cgl.cglin .cglbox{opacity:1;transform:translateY(0)}',
    '.cgllogo{width:max(220px,28vw);height:auto;display:block;margin-bottom:5vh}',
    '.cgltxt{margin:0 0 3vh 3vw;width:max(260px,26vw);font-size:clamp(15px,1.4vw,26px);line-height:1.45;font-style:italic;color:#1d1d1d}',
    '.cglgo{position:absolute;right:5vw;bottom:6vh;background:none;border:0;padding:8px 4px;cursor:pointer;color:#fff;font-family:inherit;font-style:italic;font-size:clamp(16px,1.5vw,28px);text-shadow:0 1px 6px rgba(0,0,0,.8);transition:transform .2s ease}',
    '.cglgo:hover{transform:translateX(6px)}',
    '@media (max-width:800px){.cglfade{background:linear-gradient(to bottom,rgba(255,255,255,.92) 0,rgba(255,255,255,.75) 55vh,rgba(255,255,255,.1) 100vh)}.cglbox{left:6vw;top:14vh;width:88vw}.cgllogo{width:60vw;margin-bottom:3vh}.cgltxt{margin-left:0;width:84vw;font-size:15px}.cglalp{width:36vw}.cglgo{right:6vw;bottom:5vh}}'
  ].join(' ');

  function mk(tag, cls) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    return e;
  }

  function build() {
    if (root) { return; }
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    root = mk('div', 'cgl');

    var bg = mk('img', 'cglbg');
    bg.src = BG_URL;
    bg.draggable = false;

    var fade = mk('div', 'cglfade');

    var alp = mk('img', 'cglalp');
    alp.src = ALP_URL;
    alp.draggable = false;

    var box = mk('div', 'cglbox');
    var logo = mk('img', 'cgllogo');
    logo.src = LOGO_URL;
    logo.draggable = false;
    var p1 = mk('p', 'cgltxt');
    p1.textContent = TEXT_1;
    var p2 = mk('p', 'cgltxt');
    p2.textContent = TEXT_2;
    box.appendChild(logo);
    box.appendChild(p1);
    box.appendChild(p2);

    var go = mk('button', 'cglgo');
    go.textContent = BUTTON_TEXT;
    go.addEventListener('click', close);

    root.appendChild(bg);
    root.appendChild(fade);
    root.appendChild(alp);
    root.appendChild(box);
    root.appendChild(go);
    document.body.appendChild(root);
  }

  function open() {
    build();
    root.classList.add('cglshow');
    setTimeout(function () { root.classList.add('cglin'); }, 30);
  }

  function close() {
    if (!root) { return; }
    root.classList.remove('cglin');
    setTimeout(function () { root.classList.remove('cglshow'); }, 650);
  }

  window.CGLanding = { open: open, close: close, built: true };
  if (OPEN_ON_RUN) { open(); }
})();