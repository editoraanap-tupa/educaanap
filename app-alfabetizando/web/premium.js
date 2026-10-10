/* Alfabetizando (app Android): bloqueio das trilhas e compra dentro do app.
   Regra: em cada trilha, os itens 1 e 2 ficam abertos; do item 3 em diante
   aparece um cadeado até a compra única "Trilhas completas" na Google Play.
   Este arquivo é injetado no fim de cada página pelo scripts/montar-www.mjs. */
(function () {
  'use strict';

  var PRODUTO = 'trilhas_completas';   // mesmo ID cadastrado no Play Console
  var GRATIS = 2;                      // itens abertos por trilha
  var CHAVE = 'alf:premium';
  var PRECO_PADRAO = 'R$ 19,90';       // preço cadastrado no Play Console; a loja manda o valor oficial

  function liberado() { try { return localStorage.getItem(CHAVE) === '1'; } catch (e) { return false; } }
  function marcarLiberado() {
    try { localStorage.setItem(CHAVE, '1'); } catch (e) {}
    document.documentElement.classList.add('alf-premium');
    fecharAviso();
    atualizarMapa();
    var b = document.getElementById('alfBtnHub'); if (b) b.remove();
  }

  /* ---------- Google Play Billing (cordova-plugin-purchase) ---------- */
  var loja = null, pronta = null;
  function iniciarLoja() {
    if (pronta) return pronta;
    pronta = new Promise(function (ok) {
      function iniciar() {
        if (!window.CdvPurchase) { ok(null); return; }
        var P = window.CdvPurchase, store = P.store;
        store.register([{ id: PRODUTO, type: P.ProductType.NON_CONSUMABLE, platform: P.Platform.GOOGLE_PLAY }]);
        store.when()
          .approved(function (t) { t.verify(); })
          .verified(function (r) { r.finish(); })
          .finished(function () { if (temCompra(store)) marcarLiberado(); })
          .receiptUpdated(function () { if (temCompra(store)) marcarLiberado(); })
          .productUpdated(function () { mostrarPreco(); });
        store.initialize([P.Platform.GOOGLE_PLAY]).then(function () {
          loja = store; if (temCompra(store)) marcarLiberado(); ok(store);
        }, function () { ok(null); });
      }
      if (window.cordova) document.addEventListener('deviceready', iniciar, { once: true });
      else if (document.readyState === 'complete') iniciar();
      else window.addEventListener('load', iniciar, { once: true });
    });
    return pronta;
  }
  function temCompra(store) { var p = store.get(PRODUTO); return !!(p && p.owned); }
  function preco() {
    var p = loja && loja.get(PRODUTO), o = p && p.getOffer();
    return o && o.pricingPhases && o.pricingPhases[0] ? o.pricingPhases[0].price : PRECO_PADRAO;
  }

  /* ---------- Aviso de compra, com pergunta para o adulto ---------- */
  var CSS = '' +
    '.alf-ov{position:fixed;inset:0;z-index:99999;background:rgba(31,42,68,.55);display:grid;place-items:center;padding:16px;font-family:Nunito,system-ui,sans-serif}' +
    '.alf-cx{background:#fff;color:#1f2a44;border-radius:28px;max-width:420px;width:100%;padding:26px 22px 20px;text-align:center;box-shadow:0 10px 0 rgba(31,42,68,.25)}' +
    '.alf-cx .alf-ic{font-size:64px;line-height:1}' +
    '.alf-cx h2{font-family:"Baloo 2",Nunito,sans-serif;font-size:26px;margin:8px 0 6px;line-height:1.15}' +
    '.alf-cx p{font-size:17px;margin:0 0 14px;line-height:1.4}' +
    '.alf-cx .alf-q{font-size:22px;font-weight:800;margin:6px 0 10px}' +
    '.alf-op{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:12px}' +
    '.alf-op button{min-width:64px;font:800 22px/1 Nunito,sans-serif;padding:14px 10px;border-radius:16px;border:3px solid #2490D6;background:#fff;color:#1f2a44}' +
    '.alf-b{display:block;width:100%;margin:8px 0 0;font:800 18px/1.2 Nunito,sans-serif;padding:14px;border-radius:18px;border:0;background:#2490D6;color:#fff}' +
    '.alf-b.sec{background:#eef3fb;color:#1f2a44}.alf-b.ter{background:none;color:#5b6577;font-weight:700}' +
    '.alf-msg{min-height:1.2em;font-size:15px;color:#c0392b;margin:8px 0 0}' +
    '.stop.alf-pago .pad{filter:grayscale(.75);opacity:.75}' +
    '.stop.alf-pago .lockb{display:none}' +
    '.stop.alf-pago .alf-cad{position:absolute;top:-12px;right:-12px;width:44px;height:44px;border-radius:50%;background:#FFC531;border:3px solid #fff;display:grid;place-items:center;font-size:24px;box-shadow:0 3px 0 rgba(31,42,68,.25)}' +
    '.alf-hub{position:fixed;left:50%;bottom:16px;translate:-50% 0;z-index:9000;font:800 16px/1.2 Nunito,sans-serif;padding:12px 18px;border-radius:999px;border:0;background:#2490D6;color:#fff;box-shadow:0 5px 0 rgba(31,42,68,.25)}';
  function estilo() { if (document.getElementById('alfCss')) return; var s = document.createElement('style'); s.id = 'alfCss'; s.textContent = CSS; document.head.appendChild(s); }

  var aviso = null;
  function fecharAviso() { if (aviso) { aviso.remove(); aviso = null; } }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function mostrarPreco() {
    var n = aviso && aviso.querySelector('.alf-preco'), b = aviso && aviso.querySelector('.alf-comprar');
    if (n) n.textContent = 'Pagamento único de ' + preco() + ', sem assinatura.';
    if (b) b.textContent = 'Liberar tudo por ' + preco();
  }

  function abrirAviso() {
    estilo(); fecharAviso(); iniciarLoja();
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    aviso = el('div', 'alf-ov'); aviso.setAttribute('role', 'dialog'); aviso.setAttribute('aria-modal', 'true');
    var cx = el('div', 'alf-cx'); aviso.appendChild(cx);
    aviso.addEventListener('click', function (e) { if (e.target === aviso) fecharAviso(); });
    document.body.appendChild(aviso);
    passoAdulto(cx);
  }

  // Pergunta simples para que só um adulto chegue à tela de compra.
  function passoAdulto(cx) {
    var a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 5), certo = a + b;
    var ops = [certo, certo + 1, certo - 2].sort(function () { return Math.random() - .5; });
    cx.innerHTML = '';
    cx.appendChild(el('div', 'alf-ic', '🔒'));
    cx.appendChild(el('h2', null, 'Esta brincadeira está trancadinha'));
    cx.appendChild(el('p', null, 'Chame um adulto para liberar. Adulto, responda:'));
    cx.appendChild(el('div', 'alf-q', 'Quanto é ' + a + ' + ' + b + '?'));
    var op = el('div', 'alf-op'); cx.appendChild(op);
    var msg = el('div', 'alf-msg');
    ops.forEach(function (v) {
      var bt = el('button', null, String(v)); bt.type = 'button';
      bt.onclick = function () { if (v === certo) passoCompra(cx); else { msg.textContent = 'Resposta errada. Tente de novo.'; setTimeout(function () { if (aviso) passoAdulto(cx); }, 900); } };
      op.appendChild(bt);
    });
    cx.appendChild(msg);
    var fechar = el('button', 'alf-b ter', 'Agora não'); fechar.type = 'button'; fechar.onclick = fecharAviso; cx.appendChild(fechar);
  }

  function passoCompra(cx) {
    cx.innerHTML = '';
    cx.appendChild(el('div', 'alf-ic', '🎁'));
    cx.appendChild(el('h2', null, 'Libere todas as trilhas'));
    cx.appendChild(el('p', null, 'Os itens 1 e 2 de cada trilha são grátis para conhecer. Com uma compra única, as 10 trilhas ficam liberadas por completo, para sempre, nesta conta Google.'));
    cx.appendChild(el('p', 'alf-preco'));
    var msg = el('div', 'alf-msg');
    var comprar = el('button', 'alf-b alf-comprar'); comprar.type = 'button';
    var restaurar = el('button', 'alf-b sec', 'Já comprei: restaurar'); restaurar.type = 'button';
    var fechar = el('button', 'alf-b ter', 'Agora não'); fechar.type = 'button'; fechar.onclick = fecharAviso;
    comprar.onclick = function () {
      msg.textContent = '';
      iniciarLoja().then(function (store) {
        var p = store && store.get(PRODUTO), o = p && p.getOffer();
        if (!o) { msg.textContent = store ? 'A loja ainda não respondeu. Verifique a internet e tente de novo.' : 'A compra só funciona no aplicativo instalado pela Google Play.'; return; }
        o.order().then(function (err) { if (err && err.code !== window.CdvPurchase.ErrorCode.PAYMENT_CANCELLED) msg.textContent = 'Não foi possível concluir a compra. Tente de novo.'; });
      });
    };
    restaurar.onclick = function () {
      msg.textContent = 'Procurando sua compra…';
      iniciarLoja().then(function (store) {
        if (!store) { msg.textContent = 'A compra só funciona no aplicativo instalado pela Google Play.'; return; }
        store.restorePurchases().then(function () { msg.textContent = temCompra(store) ? '' : 'Não encontramos compra nesta conta Google.'; if (temCompra(store)) marcarLiberado(); });
      });
    };
    [comprar, restaurar, fechar, msg].forEach(function (n) { cx.appendChild(n); });
    mostrarPreco();
  }

  /* ---------- Bloqueio dentro das trilhas ---------- */
  function jogos() { try { return window.AlfJogos ? window.AlfJogos() : null; } catch (e) { return null; } } // gancho do montar-www
  function trancado(id) {
    var G = jogos(); if (!G || liberado()) return false;
    var i = G.findIndex(function (g) { return g.id === id; });
    return i >= GRATIS;
  }

  // Cadeado nas paradas do mapa (do item 3 em diante).
  function atualizarMapa() {
    var G = jogos(); if (!G) return;
    var livre = liberado();
    document.querySelectorAll('.stop').forEach(function (b) {
      var rot = b.getAttribute('aria-label') || '', idx = -1, maior = 0;
      G.forEach(function (g, i) { if (rot.indexOf(g.t) === 0 && g.t.length > maior) { maior = g.t.length; idx = i; } });
      var pago = !livre && idx >= GRATIS;
      b.classList.toggle('alf-pago', pago);
      var cad = b.querySelector('.alf-cad');
      if (pago && !cad) { var pad = b.querySelector('.pad'); if (pad) pad.appendChild(el('span', 'alf-cad', '🔒')); }
      if (!pago && cad) cad.remove();
    });
  }

  function instalarTrilha() {
    if (!window.AlfJogos) return false;
    // Chamado pela página no início de openGame: true = não abre o item.
    window.AlfTrava = function (G, id) { if (!trancado(id)) return false; abrirAviso(); return true; };
    // Toque numa parada com cadeado de compra mostra o aviso, mesmo que a
    // trilha ainda não tenha chegado nela.
    document.addEventListener('click', function (e) {
      if (liberado() || !e.target.closest || !e.target.closest('.stop.alf-pago')) return;
      e.preventDefault(); e.stopImmediatePropagation(); abrirAviso();
    }, true);
    var agendado = false;
    new MutationObserver(function () {
      if (agendado) return; agendado = true;
      requestAnimationFrame(function () { agendado = false; atualizarMapa(); });
    }).observe(document.body, { childList: true, subtree: true });
    atualizarMapa();
    return true;
  }

  // Na página inicial: botão para o adulto liberar tudo de uma vez.
  function instalarInicio() {
    if (liberado()) return;
    var b = el('button', 'alf-hub', '🔓 Liberar todas as trilhas'); b.id = 'alfBtnHub'; b.type = 'button'; b.onclick = abrirAviso;
    document.body.appendChild(b);
  }

  estilo();
  if (liberado()) document.documentElement.classList.add('alf-premium');
  if (!instalarTrilha()) instalarInicio();
  iniciarLoja();
  window.Alfabetizando = { abrirAviso: abrirAviso, liberado: liberado };
})();
