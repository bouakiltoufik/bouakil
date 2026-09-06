/* ==========================================================================
   TBConnect — interactions du site vitrine
   1. Données  2. Thème  3. Navigation  4. Silhouettes + rendu
   5. Sélecteur de réservation (renvoi vers Turo)  6. Traînées du hero
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ 1. Données ---------------------------- */
  /* Une seule source de vérité : modifier ici met à jour le sélecteur du hero,
     les fiches, les liens d'avis, le CTA final et le pied de page. */
  var CARS = [
    {
      id: 'bleue',
      name: 'Dacia Sandero',
      variant: 'Bleue',
      color: 'var(--car-blue)',
      swatch: 'var(--car-blue)',
      turo: 'https://turo.com/fr/fr/location-voiture/france/cergy-95/dacia/sandero/3887182',
      boite: 'Manuelle',
      energie: 'Essence',
      places: '5',
      coffre: '328 L'
    },
    {
      id: 'blanche',
      name: 'Dacia Sandero',
      variant: 'Blanche',
      color: 'var(--car-white)',
      swatch: 'var(--car-white)',
      turo: 'https://turo.com/fr/fr/location-voiture/france/cergy-95/dacia/sandero/3876979',
      boite: 'Manuelle',
      energie: 'Essence',
      places: '5',
      coffre: '328 L'
    }
  ];

  var root = document.documentElement;

  /* ------------------------------- 2. Thème ----------------------------- */
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

  /* ---------------------------- 3. Navigation --------------------------- */
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

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8);
  }, { passive: true });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --------------------- 4. Silhouettes et rendu ------------------------ */
  /* Silhouette construite en primitives géométriques, pas en tracé dessiné. */
  function silhouette(color) {
    var x1 = 26, x2 = 176, bodyTop = 48, roofTop = 20, bottom = 74, r = 15;
    var roofX1 = x1 + 34, roofX2 = x2 - 26;
    var roof = 'M' + roofX1 + ',' + bodyTop + ' L' + (roofX1 + 18) + ',' + roofTop +
               ' L' + (roofX2 - 14) + ',' + roofTop + ' L' + roofX2 + ',' + bodyTop + ' Z';
    var glass = 'M' + (roofX1 + 11) + ',' + (bodyTop - 6) + ' L' + (roofX1 + 25) + ',' + (roofTop + 9) +
                ' L' + (roofX2 - 21) + ',' + (roofTop + 9) + ' L' + (roofX2 - 10) + ',' + (bodyTop - 6) + ' Z';

    return '<svg viewBox="0 0 200 100" role="img" aria-hidden="true" style="color:' + color + '">' +
      '<line x1="6" y1="' + (bottom + r) + '" x2="194" y2="' + (bottom + r) + '" stroke="var(--line-strong)" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="' + roof + '" fill="currentColor" stroke="var(--car-stroke)" stroke-width=".8"/>' +
      '<rect x="' + x1 + '" y="' + bodyTop + '" width="' + (x2 - x1) + '" height="' + (bottom - bodyTop) + '" rx="12" fill="currentColor" stroke="var(--car-stroke)" stroke-width=".8"/>' +
      '<path d="' + glass + '" fill="var(--surface)" opacity=".85"/>' +
      '<rect x="' + (x2 - 9) + '" y="' + (bodyTop + 6) + '" width="7" height="6" rx="2" fill="var(--surface)" opacity=".7"/>' +
      '<circle cx="' + (x1 + 36) + '" cy="' + bottom + '" r="' + r + '" fill="var(--ink)"/>' +
      '<circle cx="' + (x1 + 36) + '" cy="' + bottom + '" r="6" fill="var(--surface)"/>' +
      '<circle cx="' + (x2 - 30) + '" cy="' + bottom + '" r="' + r + '" fill="var(--ink)"/>' +
      '<circle cx="' + (x2 - 30) + '" cy="' + bottom + '" r="6" fill="var(--surface)"/>' +
      '</svg>';
  }

  function carCard(c) {
    return '<article class="car">' +
      '<div class="car__vis"><span class="car__cat">Sandero ' + c.variant.toLowerCase() + '</span>' + silhouette(c.color) + '</div>' +
      '<div class="car__body">' +
        '<div class="car__title"><h3>' + c.name + ' — ' + c.variant + '</h3><span>Cergy (95)</span></div>' +
        '<dl class="car__specs">' +
          '<div><dt>Boîte</dt><dd>' + c.boite + '</dd></div>' +
          '<div><dt>Énergie</dt><dd>' + c.energie + '</dd></div>' +
          '<div><dt>Places</dt><dd>' + c.places + '</dd></div>' +
          '<div><dt>Coffre</dt><dd>' + c.coffre + '</dd></div>' +
        '</dl>' +
        '<div class="car__foot">' +
          '<p class="car__price"><b>Tarif du jour</b><span>affiché sur l\'annonce</span></p>' +
          '<a class="btn btn--primary btn--sm" href="' + c.turo + '" target="_blank" rel="noopener noreferrer">Réserver <span aria-hidden="true">↗</span></a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  var grid = document.getElementById('fleet-grid');
  if (grid) grid.innerHTML = CARS.map(carCard).join('');

  var reviewLinks = document.getElementById('review-links');
  if (reviewLinks) {
    reviewLinks.innerHTML = CARS.map(function (c) {
      return '<a class="rev-link" href="' + c.turo + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="rev-link__dot" style="background:' + c.swatch + '" aria-hidden="true"></span>' +
        '<span class="rev-link__txt"><b>' + c.name + ' ' + c.variant.toLowerCase() + '</b>' +
        '<span>Voir les avis et les disponibilités sur Turo</span></span>' +
        '<span class="rev-link__go" aria-hidden="true">↗</span></a>';
    }).join('');
  }

  var finalCta = document.getElementById('final-cta');
  if (finalCta) {
    finalCta.innerHTML = CARS.map(function (c, i) {
      return '<a class="btn ' + (i === 0 ? 'btn--light' : 'btn--outline') + '" href="' + c.turo +
        '" target="_blank" rel="noopener noreferrer">La ' + c.variant.toLowerCase() + ' <span aria-hidden="true">↗</span></a>';
    }).join('');
  }

  var footCars = document.getElementById('foot-cars');
  if (footCars) {
    footCars.innerHTML = CARS.map(function (c) {
      return '<a href="' + c.turo + '" target="_blank" rel="noopener noreferrer">Sandero ' + c.variant.toLowerCase() + ' ↗</a>';
    }).join('');
  }

  /* ------------- 5. Sélecteur de réservation (renvoi vers Turo) ---------- */
  var picker = document.getElementById('picker');
  var cta = document.getElementById('cta-turo');
  var inDep = document.getElementById('depart');
  var inRet = document.getElementById('retour');
  var outDays = document.getElementById('est-days');
  var outDetail = document.getElementById('est-detail');
  var selected = CARS[0].id;

  function selectedCar() {
    return CARS.filter(function (c) { return c.id === selected; })[0] || CARS[0];
  }

  function renderPicker() {
    if (!picker) return;
    picker.innerHTML = CARS.map(function (c) {
      return '<button type="button" role="radio" class="pick" data-id="' + c.id + '" aria-checked="' + (c.id === selected) + '">' +
        '<span class="pick__swatch" style="background:' + c.swatch + '" aria-hidden="true"></span>' +
        '<span class="pick__txt"><b>' + c.name + '</b><span>' + c.variant + ' · Cergy</span></span></button>';
    }).join('');
    picker.querySelectorAll('.pick').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selected = btn.dataset.id;
        renderPicker();
        syncCta();
      });
    });
  }

  function syncCta() {
    var c = selectedCar();
    if (cta) {
      cta.href = c.turo;
      cta.innerHTML = 'Voir les dates de la ' + c.variant.toLowerCase() + ' sur Turo <span aria-hidden="true">↗</span>';
    }
  }

  function iso(d) { return d.toISOString().slice(0, 10); }

  if (inDep && inRet) {
    var today = new Date();
    inDep.value = iso(new Date(today.getTime() + 2 * 864e5));
    inRet.value = iso(new Date(today.getTime() + 5 * 864e5));
    inDep.min = iso(today);
    inRet.min = inDep.value;
  }

  function updateDuration() {
    if (!inDep || !inRet || !outDays) return;
    var d1 = new Date(inDep.value), d2 = new Date(inRet.value);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) {
      outDays.textContent = '—';
      outDetail.textContent = 'La date de retour doit être postérieure au départ.';
      return;
    }
    var days = Math.max(1, Math.round((d2 - d1) / 864e5));
    outDays.textContent = days + ' jour' + (days > 1 ? 's' : '');
    outDetail.textContent = 'Du ' + d1.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) +
      ' au ' + d2.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) +
      ' — à confirmer sur Turo, avec le tarif du jour.';
  }

  if (inDep) {
    inDep.addEventListener('change', function () {
      if (inRet) {
        inRet.min = inDep.value;
        if (inRet.value <= inDep.value) inRet.value = iso(new Date(new Date(inDep.value).getTime() + 864e5));
      }
      updateDuration();
    });
  }
  if (inRet) inRet.addEventListener('change', updateDuration);

  renderPicker();
  syncCta();
  updateDuration();

  /* ------------------ 6. Traînées lumineuses du hero -------------------- */
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
