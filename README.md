# TBConnect — site vitrine location de voiture

Site vitrine statique (HTML/CSS/JS, sans dépendance ni build) pour l'agence de
location de véhicules **TBConnect**. La structure reprend les codes des landing
pages SaaS type SuperHote — hero + preuve sociale, comparatif avant/après,
sections produit, chiffres, avis, formules, FAQ, CTA final — appliqués au monde
de la location : moteur de réservation, flotte filtrable, franchises et
kilométrages.

## Aperçu

| | |
|---|---|
| Palette | indigo `#3A38E8` → violet `#7B5CFF` sur gris à biais bleu `#F5F6FA`, ambre en signal, vert pour l'inclus |
| Typographie | Bricolage Grotesque (titres) · Instrument Sans (texte) · IBM Plex Mono (tarifs, specs, plaques) |
| Thèmes | clair et sombre complets — préférence système + bouton de bascule mémorisé |
| Accessibilité | navigation clavier, focus visibles, `aria-*` sur les onglets de flotte, `prefers-reduced-motion` respecté |

## Fonctionnalités

- **Moteur de réservation** dans le hero : agence, dates, catégorie → estimation
  TTC calculée en direct (dégressivité −8 % dès 3 jours, −15 % dès 7 jours,
  livraison +39 €). La validation filtre la flotte sur la catégorie choisie.
- **Flotte filtrable** : 14 véhicules, 6 catégories, fiches techniques
  (boîte, énergie, places, coffre) et silhouettes SVG générées en primitives
  géométriques, teintées par catégorie et compatibles avec les deux thèmes.
- **Traînées lumineuses** en `<canvas>` sous le hero (désactivées si l'utilisateur
  a demandé moins d'animations).
- **FAQ** en `<details>` natifs, menu mobile, plaque d'immatriculation comme logo.

## Structure

```
index.html                 page complète
assets/css/style.css       tokens de thème puis composants, dans l'ordre des sections
assets/js/app.js           thème, navigation, flotte, réservation, canvas
build/make-artifact.sh     assemble dist/tbconnect.html (fichier unique, CSS+JS inlinés)
dist/tbconnect.html        version mono-fichier, pour publication en Artifact
```

## Lancer en local

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

Regénérer la version mono-fichier après une modification :

```bash
./build/make-artifact.sh
```

## À personnaliser avant mise en ligne

Le contenu est rédigé, pas générique, mais il reste à remplacer par les données
réelles de l'agence : numéro de téléphone (`01 00 00 00 00`), adresse et
horaires des quatre agences, e-mail de contact, tarifs et catalogue de la flotte
(tableau `FLEET` dans `assets/js/app.js`), avis clients, et les pages légales
listées en pied de page. Le formulaire de réservation ne fait aujourd'hui
qu'estimer un tarif : il faudra le brancher sur un back-office ou un e-mail.
