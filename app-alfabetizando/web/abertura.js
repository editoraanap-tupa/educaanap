/* Alfabetizando (app Android): deixa a tela de abertura mais viva.
   Acrescenta morros, flores, borboletas e letras que flutuam no céu, e mostra
   os 10 mascotes maiores, em duas fileiras, no gramado. Só enfeita: não muda
   o funcionamento da abertura. Injetado na página inicial pelo montar-www. */
(function () {
  'use strict';
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CSS = '' +
    '.ab-open .alf-morros{position:absolute;left:0;right:0;top:calc(58% - 9vh);height:12vh;z-index:0}' +
    '.ab-open .alf-morros svg{width:100%;height:100%;display:block}' +
    '.ab-open .alf-chao{position:absolute;left:0;right:0;bottom:0;top:58%;z-index:0;pointer-events:none}' +
    '.ab-open .alf-flor{position:absolute;width:clamp(18px,3.4vw,30px);transform-origin:50% 100%;animation:alfBalanca 2.6s ease-in-out infinite alternate}' +
    '.ab-open .alf-bor{position:absolute;width:clamp(22px,3.6vw,34px);animation:alfVoa 11s ease-in-out infinite}' +
    '.ab-open .alf-bor .asa{transform-box:fill-box;transform-origin:right center;animation:alfBate .22s ease-in-out infinite alternate}' +
    '.ab-open .alf-letra{position:absolute;bottom:42%;font:800 clamp(22px,4.4vw,40px)/1 var(--brand,"Baloo 2",sans-serif);color:#fff;opacity:0;text-shadow:0 3px 0 rgba(27,42,94,.18);animation:alfSobe 9s linear infinite}' +
    '.ab-open .ab-desfile{display:flex!important;flex-wrap:wrap;justify-content:center;row-gap:2px;bottom:2vh;padding:0 10px}' +
    '.ab-open .ab-desfile span{display:block!important;width:clamp(56px,15vw,96px)}' +
    '@media (min-width:700px){.ab-open .ab-desfile{flex-wrap:nowrap}.ab-open .ab-desfile span{width:clamp(56px,8vw,96px)}}' +
    '@keyframes alfBalanca{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}' +
    '@keyframes alfBate{to{transform:scaleX(.25)}}' +
    '@keyframes alfVoa{0%,100%{transform:translate(0,0)}25%{transform:translate(18vw,-6vh)}50%{transform:translate(36vw,1vh)}75%{transform:translate(14vw,5vh)}}' +
    '@keyframes alfSobe{0%{transform:translateY(0) rotate(-8deg);opacity:0}12%{opacity:.85}80%{opacity:.85}100%{transform:translateY(-34vh) rotate(8deg);opacity:0}}' +
    '@media (prefers-reduced-motion: reduce){.ab-open .alf-flor,.ab-open .alf-bor,.ab-open .alf-letra{animation:none!important}.ab-open .alf-letra{display:none}}';

  function estilo() {
    if (document.getElementById('alfAbCss')) return;
    var s = document.createElement('style'); s.id = 'alfAbCss'; s.textContent = CSS; document.head.appendChild(s);
  }

  var CORES = ['#EE4F7B', '#F7A823', '#FFFFFF', '#8752C8', '#FFD25A', '#2490D6'];
  function flor(cor) {
    var p = '';
    for (var a = 0; a < 360; a += 72) p += '<circle cx="' + (12 + Math.cos(a * Math.PI / 180) * 6).toFixed(1) + '" cy="' + (10 + Math.sin(a * Math.PI / 180) * 6).toFixed(1) + '" r="5" fill="' + cor + '"/>';
    return '<svg viewBox="0 0 24 40" aria-hidden="true"><path d="M12 14v26" stroke="#3D8B2E" stroke-width="2.6"/><path d="M12 30q-8-2-9-9q7 0 9 7" fill="#4DB843"/>' + p + '<circle cx="12" cy="10" r="4" fill="#F7A823"/></svg>';
  }
  var BORBOLETA = '<svg viewBox="0 0 30 22" aria-hidden="true"><g class="asa"><path d="M15 9Q2-3 2 9t13 2z" fill="#F7A823"/></g><g transform="translate(30 0) scale(-1 1)"><g class="asa"><path d="M15 9Q2-3 2 9t13 2z" fill="#EE4F7B"/></g></g><path d="M15 4v14" stroke="#1B2A5E" stroke-width="2" stroke-linecap="round"/></svg>';

  function enfeitar(ov) {
    if (!ov || ov.querySelector('.alf-chao')) return;
    var ceu = ov.querySelector('.ab-sky'); if (!ceu) return;
    estilo();
    var m = document.createElement('div'); m.className = 'alf-morros';
    m.innerHTML = '<svg viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V34Q60 4 130 30T260 22Q330 6 400 30V60z" fill="#B7E38F"/><path d="M0 60V46Q90 24 190 44T400 40V60z" fill="#9ED86A"/></svg>';
    ceu.appendChild(m);
    var chao = document.createElement('div'); chao.className = 'alf-chao';
    var pos = [[4, 8], [14, 30], [26, 12], [70, 10], [82, 32], [93, 14], [8, 52], [90, 54]];
    pos.forEach(function (p, k) {
      var f = document.createElement('span'); f.className = 'alf-flor'; f.innerHTML = flor(CORES[k % CORES.length]);
      f.style.left = p[0] + '%'; f.style.top = p[1] + '%'; f.style.animationDelay = (-k * .37) + 's';
      chao.appendChild(f);
    });
    [[6, -18, 0], [62, -30, -5]].forEach(function (b) {
      var s = document.createElement('span'); s.className = 'alf-bor'; s.innerHTML = BORBOLETA;
      s.style.left = b[0] + '%'; s.style.top = b[1] + '%'; s.style.animationDelay = b[2] + 's';
      chao.appendChild(s);
    });
    ceu.appendChild(chao);
    if (!calmo) {
      'AaBbCcDeLmOoRsTu'.split('').forEach(function (c, k) {
        var l = document.createElement('span'); l.className = 'alf-letra'; l.textContent = c;
        l.style.left = (4 + (k * 37) % 92) + '%';
        l.style.color = CORES[k % CORES.length] === '#FFFFFF' ? '#fff' : CORES[k % CORES.length];
        l.style.animationDelay = (-k * 0.6) + 's';
        l.style.animationDuration = (8 + (k % 4)) + 's';
        ceu.appendChild(l);
      });
    }
  }

  enfeitar(document.getElementById('abOpen'));
  new MutationObserver(function () { enfeitar(document.getElementById('abOpen')); })
    .observe(document.body, { childList: true });
})();
