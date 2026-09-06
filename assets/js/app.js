/* ==========================================================================
   TBConnect — interactions du site vitrine
   1. Thème  2. Navigation  3. Flotte (données + rendu + filtre)
   4. Moteur de réservation  5. Traînées lumineuses du hero
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ 1. Thème ------------------------------ */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('tbc-theme'); } catch (e) { /* navigation privée */ }
  if (stored === 'dark' || stored === 'light') root.setAttribute('data-theme', stored);

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tbc-theme', next); } catch (e) { /* ignoré */ }
      themeBtn.setAttribute('aria-label', next === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre');
    });
  }

  /* --------------------------- 2. Navigation ---------------------------- */
  var nav = document.querySelector('.nav');
  var burger = document.getElementById('burger');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var onScroll = function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------ 3. Flotte ----------------------------- */
  var CATEGORIES = [
    { id: 'citadine',    label: 'Citadine',    price: 34,  tone: 'accent' },
    { id: 'berline',     label: 'Berline',     price: 52,  tone: 'accent' },
    { id: 'suv',         label: 'SUV',         price: 68,  tone: 'accent2' },
    { id: 'utilitaire',  label: 'Utilitaire',  price: 59,  tone: 'ink' },
    { id: 'electrique',  label: 'Électrique',  price: 62,  tone: 'good' },
    { id: 'premium',     label: 'Premium',     price: 119, tone: 'accent2' }
  ];

  var FLEET = [
    { cat:'citadine',   name:'Renault Clio V',        trim:'1.0 TCe 90',       price:34,  boite:'Manuelle',  energie:'Essence',    places:'5', coffre:'391 L' },
    { cat:'citadine',   name:'Peugeot 208',           trim:'PureTech 100',     price:36,  boite:'Auto EAT8', energie:'Essence',    places:'5', coffre:'352 L' },
    { cat:'citadine',   name:'Toyota Yaris',          trim:'Hybride 116h',     price:41,  boite:'Auto',      energie:'Hybride',    places:'5', coffre:'286 L' },
    { cat:'berline',    name:'Peugeot 508',           trim:'BlueHDi 130',      price:52,  boite:'Auto EAT8', energie:'Diesel',     places:'5', coffre:'487 L' },
    { cat:'berline',    name:'Volkswagen Passat SW',  trim:'2.0 TDI 150',      price:58,  boite:'Auto DSG',  energie:'Diesel',     places:'5', coffre:'650 L' },
    { cat:'suv',        name:'Dacia Duster',          trim:'TCe 130 4x2',      price:49,  boite:'Manuelle',  energie:'Essence',    places:'5', coffre:'478 L' },
    { cat:'suv',        name:'Peugeot 3008',          trim:'Hybrid 136',       price:68,  boite:'Auto e-DCS',energie:'Hybride',    places:'5', coffre:'520 L' },
    { cat:'suv',        name:'Volkswagen T-Roc',      trim:'1.5 TSI 150',      price:64,  boite:'Auto DSG',  energie:'Essence',    places:'5', coffre:'445 L' },
    { cat:'utilitaire', name:'Renault Trafic',        trim:'L1H1 · 6 m³',      price:59,  boite:'Manuelle',  energie:'Diesel',     places:'3', coffre:'6 m³' },
    { cat:'utilitaire', name:'Peugeot Boxer',         trim:'L2H2 · 11,5 m³',   price:79,  boite:'Manuelle',  energie:'Diesel',     places:'3', coffre:'11,5 m³' },
    { cat:'electrique', name:'Renault Mégane E-Tech', trim:'EV60 · 450 km',    price:62,  boite:'Auto',      energie:'100 % élec.',places:'5', coffre:'440 L' },
    { cat:'electrique', name:'Tesla Model 3',         trim:'Propulsion · 513 km', price:89, boite:'Auto',   energie:'100 % élec.',places:'5', coffre:'594 L' },
    { cat:'premium',    name:'BMW Série 5',           trim:'520d xDrive',      price:119, boite:'Auto',      energie:'Diesel',     places:'5', coffre:'520 L' },
    { cat:'premium',    name:'Mercedes Classe E',     trim:'E 220 d AMG Line', price:139, boite:'Auto 9G',   energie:'Diesel',     places:'5', coffre:'540 L' }
  ];

  /* Silhouettes : construites en primitives (pas de tracé dessiné à la main) */
  var SHAPES = {
    citadine:   { x1: 30, x2: 172, bodyTop: 50, roofTop: 22, rf: 34, rr: 24, wf: 66, wr: 142, r: 15 },
    berline:    { x1: 18, x2: 186, bodyTop: 52, roofTop: 26, rf: 44, rr: 40, wf: 60, wr: 150, r: 15 },
    suv:        { x1: 24, x2: 180, bodyTop: 44, roofTop: 14, rf: 32, rr: 22, wf: 64, wr: 146, r: 18 },
    utilitaire: { x1: 16, x2: 188, bodyTop: 46, roofTop: 12, rf: 26, rr: 4,  wf: 58, wr: 156, r: 16, box: true },
    electrique: { x1: 20, x2: 184, bodyTop: 50, roofTop: 20, rf: 40, rr: 34, wf: 62, wr: 148, r: 16 },
    premium:    { x1: 14, x2: 190, bodyTop: 54, roofTop: 28, rf: 50, rr: 44, wf: 58, wr: 152, r: 15 }
  };

  var TONE = { accent: 'var(--accent)', accent2: 'var(--accent-2)', good: 'var(--good)', ink: 'var(--ink-2)' };

  function silhouette(cat) {
    var s = SHAPES[cat] || SHAPES.berline;
    var tone = TONE[(CATEGORIES.filter(function (c) { return c.id === cat; })[0] || {}).tone] || TONE.accent;
    var bottom = 74;
    var roofX1 = s.x1 + s.rf;
    var roofX2 = s.x2 - s.rr;
    var roof = 'M' + roofX1 + ',' + s.bodyTop +
               ' L' + (roofX1 + (s.box ? 4 : 18)) + ',' + s.roofTop +
               ' L' + (roofX2 - (s.box ? 2 : 14)) + ',' + s.roofTop +
               ' L' + roofX2 + ',' + s.bodyTop + ' Z';
    var glass = 'M' + (roofX1 + 11) + ',' + (s.bodyTop - 6) +
                ' L' + (roofX1 + (s.box ? 12 : 25)) + ',' + (s.roofTop + 9) +
                ' L' + (roofX2 - (s.box ? 10 : 21)) + ',' + (s.roofTop + 9) +
                ' L' + (roofX2 - 10) + ',' + (s.bodyTop - 6) + ' Z';

    return '<svg viewBox="0 0 200 100" role="img" aria-hidden="true" style="color:' + tone + '">' +
      '<line x1="6" y1="' + (bottom + s.r) + '" x2="194" y2="' + (bottom + s.r) + '" stroke="var(--line-strong)" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="' + roof + '" fill="currentColor" opacity=".9"/>' +
      '<rect x="' + s.x1 + '" y="' + s.bodyTop + '" width="' + (s.x2 - s.x1) + '" height="' + (bottom - s.bodyTop) + '" rx="' + (s.box ? 7 : 12) + '" fill="currentColor" opacity=".9"/>' +
      '<path d="' + glass + '" fill="var(--surface)" opacity=".82"/>' +
      '<rect x="' + (s.x2 - 9) + '" y="' + (s.bodyTop + 6) + '" width="7" height="6" rx="2" fill="var(--surface)" opacity=".7"/>' +
      '<circle cx="' + s.wf + '" cy="' + bottom + '" r="' + s.r + '" fill="var(--ink)"/>' +
      '<circle cx="' + s.wf + '" cy="' + bottom + '" r="' + Math.round(s.r * 0.42) + '" fill="var(--surface)"/>' +
      '<circle cx="' + s.wr + '" cy="' + bottom + '" r="' + s.r + '" fill="var(--ink)"/>' +
      '<circle cx="' + s.wr + '" cy="' + bottom + '" r="' + Math.round(s.r * 0.42) + '" fill="var(--surface)"/>' +
      '</svg>';
  }

  function catLabel(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? c.label : id;
  }

  function carCard(v) {
    return '<article class="car">' +
      '<div class="car__vis"><span class="car__cat">' + catLabel(v.cat) + '</span>' + silhouette(v.cat) + '</div>' +
      '<div class="car__body">' +
        '<div class="car__title"><h3>' + v.name + '</h3><span>' + v.trim + '</span></div>' +
        '<dl class="car__specs">' +
          '<div><dt>Boîte</dt><dd>' + v.boite + '</dd></div>' +
          '<div><dt>Énergie</dt><dd>' + v.energie + '</dd></div>' +
          '<div><dt>Places</dt><dd>' + v.places + '</dd></div>' +
          '<div><dt>Coffre</dt><dd>' + v.coffre + '</dd></div>' +
        '</dl>' +
        '<div class="car__foot">' +
          '<p class="car__price"><b>' + v.price + ' €</b><span>par jour, tout inclus</span></p>' +
          '<a class="btn btn--ghost btn--sm" href="#reserver">Réserver</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  var grid = document.getElementById('fleet-grid');
  var chips = document.getElementById('chips');
  var fleetNote = document.getElementById('fleet-note');
  var activeCat = 'all';

  function renderFleet() {
    if (!grid) return;
    var list = activeCat === 'all' ? FLEET : FLEET.filter(function (v) { return v.cat === activeCat; });
    grid.innerHTML = list.map(carCard).join('');
    if (fleetNote) {
      fleetNote.textContent = list.length + ' véhicule' + (list.length > 1 ? 's' : '') +
        (activeCat === 'all' ? ' au catalogue' : ' en catégorie ' + catLabel(activeCat).toLowerCase()) +
        ' — tarifs TTC pour une location de 3 jours ou plus, assurance et assistance comprises.';
    }
  }

  function renderChips() {
    if (!chips) return;
    var all = [{ id: 'all', label: 'Toute la flotte' }].concat(CATEGORIES);
    chips.innerHTML = all.map(function (c) {
      return '<button type="button" role="tab" class="chip" data-cat="' + c.id + '" aria-selected="' +
        (c.id === activeCat) + '">' + c.label + '</button>';
    }).join('');
    chips.querySelectorAll('.chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCat = btn.dataset.cat;
        renderChips();
        renderFleet();
      });
    });
  }

  renderChips();
  renderFleet();

  /* --------------------- 4. Moteur de réservation ----------------------- */
  var selCat = document.getElementById('categorie');
  var selAgence = document.getElementById('agence');
  var inDep = document.getElementById('depart');
  var inRet = document.getElementById('retour');
  var outTotal = document.getElementById('est-total');
  var outDetail = document.getElementById('est-detail');
  var form = document.getElementById('reserver');

  function iso(d) { return d.toISOString().slice(0, 10); }

  if (selCat) {
    selCat.innerHTML = CATEGORIES.map(function (c) {
      return '<option value="' + c.id + '">' + c.label + ' — à partir de ' + c.price + ' €/jour</option>';
    }).join('');
    selCat.value = 'citadine';
  }

  if (inDep && inRet) {
    var today = new Date();
    var start = new Date(today.getTime() + 2 * 864e5);
    var end = new Date(today.getTime() + 6 * 864e5);
    inDep.value = iso(start);
    inRet.value = iso(end);
    inDep.min = iso(today);
    inRet.min = iso(start);
  }

  var euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  function estimate() {
    if (!inDep || !inRet || !selCat || !outTotal) return;
    var d1 = new Date(inDep.value), d2 = new Date(inRet.value);
    var cat = CATEGORIES.filter(function (c) { return c.id === selCat.value; })[0] || CATEGORIES[0];

    if (isNaN(d1) || isNaN(d2) || d2 <= d1) {
      outTotal.textContent = '—';
      outDetail.textContent = 'La date de retour doit être postérieure au départ.';
      return;
    }

    var days = Math.max(1, Math.round((d2 - d1) / 864e5));
    var discount = days >= 7 ? 0.15 : days >= 3 ? 0.08 : 0;
    var base = cat.price * days * (1 - discount);
    var delivery = selAgence && selAgence.value === 'livraison' ? 39 : 0;
    var total = Math.round(base + delivery);

    outTotal.textContent = euro.format(total);

    var parts = [days + ' jour' + (days > 1 ? 's' : '') + ' × ' + cat.price + ' €'];
    if (discount) parts.push('remise longue durée −' + Math.round(discount * 100) + ' %');
    if (delivery) parts.push('livraison 39 €');
    parts.push(days >= 3 ? 'kilomètres illimités' : '250 km/jour inclus');
    outDetail.textContent = parts.join(' · ');
  }

  [inDep, inRet, selCat, selAgence].forEach(function (el) {
    if (el) el.addEventListener('change', estimate);
  });
  if (inDep) {
    inDep.addEventListener('change', function () {
      if (inRet) {
        inRet.min = inDep.value;
        if (inRet.value <= inDep.value) {
          var next = new Date(new Date(inDep.value).getTime() + 864e5);
          inRet.value = iso(next);
        }
      }
      estimate();
    });
  }
  estimate();

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      activeCat = selCat ? selCat.value : 'all';
      renderChips();
      renderFleet();
      var target = document.getElementById('flotte');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ------------------ 5. Traînées lumineuses du hero -------------------- */
  var canvas = document.getElementById('road');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var trails = [];
    var w = 0, h = 0;

    function accentColor() {
      return getComputedStyle(root).getPropertyValue('--accent').trim() || '#3A38E8';
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      trails = [];
      var lanes = 7;
      for (var i = 0; i < lanes; i++) {
        var t = i / (lanes - 1);
        trails.push({
          y: 24 + t * (h - 40),
          len: 60 + Math.random() * 190,
          x: Math.random() * w,
          speed: 0.35 + t * 1.5,
          alpha: 0.10 + t * 0.22,
          weight: 1 + t * 2.2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var col = accentColor();
      trails.forEach(function (tr) {
        var g = ctx.createLinearGradient(tr.x, 0, tr.x + tr.len, 0);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, col);
        ctx.globalAlpha = tr.alpha;
        ctx.strokeStyle = g;
        ctx.lineWidth = tr.weight;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tr.x, tr.y);
        ctx.lineTo(tr.x + tr.len, tr.y);
        ctx.stroke();
        if (!reduced) {
          tr.x += tr.speed;
          if (tr.x > w) tr.x = -tr.len - Math.random() * 240;
        }
      });
      ctx.globalAlpha = 1;
      if (!reduced) requestAnimationFrame(draw);
    }

    resize(); seed(); draw();
    window.addEventListener('resize', function () { resize(); seed(); if (reduced) draw(); });
    if (themeBtn) themeBtn.addEventListener('click', function () { if (reduced) draw(); });
  }
})();
