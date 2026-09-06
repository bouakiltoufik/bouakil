# TBConnect — site vitrine location de voiture

Site vitrine statique (HTML/CSS/JS, sans dépendance ni build) pour **TBConnect** :
deux Dacia Sandero en location à Cergy (95). Le site ne prend aucune réservation
lui-même — chaque bouton renvoie vers l'annonce Turo de la voiture concernée, qui
gère le paiement, l'assurance, l'assistance et les avis. La structure reprend les
codes des landing pages SaaS type SuperHote (hero, comparatif avant/après,
sections produit, méthode, FAQ, CTA final), appliqués à une flotte de deux
voitures.

## Aperçu

| | |
|---|---|
| Palette | indigo `#3A38E8` → violet `#7B5CFF` sur gris à biais bleu `#F5F6FA`, ambre en signal, vert pour l'inclus |
| Typographie | Bricolage Grotesque (titres) · Instrument Sans (texte) · IBM Plex Mono (tarifs, specs, plaques) |
| Thèmes | clair et sombre complets — préférence système + bouton de bascule mémorisé |
| Accessibilité | navigation clavier, focus visibles, `aria-*` sur les onglets de flotte, `prefers-reduced-motion` respecté |

## Fonctionnalités

- **Sélecteur de réservation** dans le hero : choix de la voiture (bleue ou
  blanche) et des dates souhaitées, durée calculée en direct, puis redirection
  vers la bonne annonce Turo. Aucun tarif n'est affiché sur le site : il est
  dynamique et fait foi sur Turo.
- **Fiches véhicules** : boîte, énergie, places, coffre, et silhouettes SVG
  générées en primitives géométriques, teintées à la couleur réelle de chaque
  voiture et compatibles avec les deux thèmes.
- **Avis** : pas de témoignage écrit sur le site, uniquement des liens vers les
  avis publics et vérifiés de chaque annonce Turo.
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

## Source de vérité : le tableau `CARS`

Les deux voitures sont décrites une seule fois, en haut de `assets/js/app.js`.
Ce tableau alimente le sélecteur du hero, les fiches, les liens d'avis, le CTA
final et le pied de page — les liens Turo n'existent qu'à cet endroit.

## À vérifier avant mise en ligne

Les liens Turo sont ceux fournis par le propriétaire ; Turo bloquant la lecture
automatique de ses pages, les caractéristiques n'ont **pas** pu être recopiées
depuis les annonces. À confirmer dans `CARS` avant publication :

- boîte de vitesses (`Manuelle` par défaut) et énergie (`Essence` par défaut,
  à corriger si l'une des voitures est en GPL Eco-G) ;
- volume de coffre (`328 L`, valeur catalogue de la Sandero III) ;
- millésime, si vous souhaitez l'afficher à côté du modèle.

Restent également à compléter : le point de rendez-vous exact à Cergy, les
communes réellement desservies en livraison, et un moyen de contact direct si
vous ne voulez pas tout faire passer par la messagerie Turo.
