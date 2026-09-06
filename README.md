# TBConnect — site vitrine

Site vitrine statique (HTML/CSS/JS, sans dépendance ni build) pour **TBConnect** :
deux Dacia Sandero en location à Cergy (95). Le site ne prend aucune réservation
lui-même — chaque bouton renvoie vers l'annonce Turo de la voiture concernée, qui
gère le paiement, l'assurance, l'assistance et les avis.

Deux habillages du **même contenu** cohabitent dans le dépôt :

| | Racine `/` — variante « labo » | `/v1/` — variante « SaaS » |
|---|---|---|
| Référence | mentionlab.ai | superhote.com |
| Couleur | vert `#09C17A`, vert profond `#052E1C` | indigo `#3A38E8` → violet `#7B5CFF` |
| Typo | Plus Jakarta Sans · JetBrains Mono · Caveat | Bricolage Grotesque · Instrument Sans · IBM Plex Mono |
| Signature | trame de points, annotations manuscrites, hero centré | traînées de phares en canvas, plaque d'immatriculation, hero en deux colonnes |

C'est la variante verte qui est déployée à la racine. Pour intervertir les deux,
il suffit d'échanger le contenu de `/` et de `/v1/`.

## Fonctionnalités communes

- **Sélecteur de réservation** : choix de la voiture (bleue ou blanche) et des
  dates souhaitées, durée calculée en direct, puis redirection vers la bonne
  annonce Turo. Aucun tarif n'est affiché : il est dynamique et fait foi sur Turo.
- **Fiches véhicules** : boîte, énergie, places, coffre, et silhouettes SVG
  générées en primitives géométriques, teintées à la couleur réelle de chaque
  voiture et compatibles avec les deux thèmes.
- **Avis** : aucun témoignage écrit sur le site, uniquement des liens vers les
  avis publics et vérifiés de chaque annonce Turo.
- Thèmes clair et sombre complets (préférence système + bascule mémorisée),
  navigation clavier, focus visibles, `prefers-reduced-motion` respecté.

## Structure

```
index.html                 variante « labo » (le site déployé)
assets/                    css, js, favicon.svg, og.png de la variante déployée
v1/index.html              variante « SaaS », avec ses propres assets/
404.html                   page d'erreur assortie
robots.txt · sitemap.xml   référencement
.github/workflows/pages.yml  déploiement GitHub Pages
build/make-artifact.sh     assemble dist/tbconnect-v1.html et dist/tbconnect-v2.html
```

## Source de vérité : le tableau `CARS`

Les deux voitures sont décrites une seule fois, en haut de `assets/js/app.js`
(et de `v1/assets/js/app.js` pour l'autre variante). Ce tableau alimente le
sélecteur, les fiches, les liens d'avis, le CTA final et le pied de page — les
liens Turo n'existent qu'à cet endroit.

## Mise en ligne

Le workflow `.github/workflows/pages.yml` publie le dépôt entier sur GitHub Pages
à chaque push. Pour l'activer une première fois :

1. **Settings → Pages → Build and deployment → Source : GitHub Actions**.
2. Relancer le workflow (onglet Actions → *Déploiement GitHub Pages* → *Run workflow*)
   si le premier passage a eu lieu avant l'activation.
3. Le site est alors servi sur `https://bouakiltoufik.github.io/bouakil/`.

**Nom de domaine.** Pour brancher un domaine, ajouter un fichier `CNAME` à la
racine contenant le domaine, puis créer chez le registrar un enregistrement
`CNAME` pointant vers `bouakiltoufik.github.io`. Penser alors à remplacer l'URL
dans `<link rel="canonical">`, `robots.txt` et `sitemap.xml`.

## Lancer en local

```bash
python3 -m http.server 8000   # puis http://localhost:8000
./build/make-artifact.sh      # regénère les versions mono-fichier dans dist/
```

## À vérifier avant d'annoncer le site

Turo bloquant la lecture automatique de ses pages, les caractéristiques n'ont
**pas** pu être recopiées depuis les annonces. À confirmer dans `CARS` :

- boîte de vitesses (`Manuelle` par défaut) et énergie (`Essence` par défaut,
  à corriger si l'une des voitures est en GPL Eco-G) ;
- volume de coffre (`328 L`, valeur catalogue de la Sandero III) ;
- millésime, si vous souhaitez l'afficher à côté du modèle.

Restent à compléter : le point de rendez-vous exact à Cergy, les communes
réellement desservies en livraison, et un moyen de contact direct si vous ne
voulez pas tout faire passer par la messagerie Turo.
