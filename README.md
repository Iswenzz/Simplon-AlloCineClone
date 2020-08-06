![](https://i.imgur.com/XFvRaaO.png)
# Simplon JS TP
![](https://i.imgur.com/tgjrlN8.png)

# AlloCinéClone
L'objectif est de créer un site internet de recherche d’informations sur des films. Grâce à ce site, on va pouvoir recherche n’importe quel film et connaître toutes les infos liés au film (titre, durée, réalisateur, etc ..).

## Livrables
- Un dépôt Gitlab contenant votre code source (HTML, SASS, CSS, Images, ...), ainsi que le schéma de votre maquette graphique. Ce schéma doit être au format image (JPG, PNG) et peut être fait soit sur un outil numérique ou alors juste en mode papier/crayon (prendre une photo) - A rendre pour le 06/08/2020, avant 13H30.

## Contexte du projet
L'objectif est de créer un site internet de recherche d’informations sur des films. Grâce à ce site, on va pouvoir recherche n’importe quel film et connaître toutes les infos liés au film (titre, durée, réalisateur, etc ..). Pour toutes les informations, nous allons utilisé l’API de The Movie DB : https://developers.themoviedb.org/3/getting-started/introduction

Le site doit proposer un champ de recherche qui permet de taper le titre d’un film et de faire une recherche sur la base. La recherche doit donner une liste des meilleures correspondance avec ce que l’utilisateur a tapé. Cette liste devra être sur plusieurs pages.

Chaque élément des résultats de recherche doit être cliquable et amène vers la page du film. Dans cette page, on affiche toutes les informations utiles pour le film. A vous de déterminer les informations les plus pertinentes.

Aucune maquette graphique n'a été définie pour le site, vous avez carte blanche. Vous pouvez le créer en mono-page ou en multi-page. On va mettre l’accent sur l’UI/UX, l’accessibilité et le SEO du site.

Il s’agit d’un produit minimum viable. Vous pouvez ensuite ajouter toutes fonctionnalités qui vous semble pertinentes. Quelques exemples : Pouvoir aussi chercher des séries Pouvoir chercher des acteurs et réalisateurs, et connaître leur filmographie Ajouter un carrousel des Top films du moment sur la page d’accueil Ajouter la possibilité de filtrer / trier les résultats de la recherche Ajouter des suggestions de films basé sur la recherche

L’utilisation de l’API TheMovieDB est protégé par une clé d’API. Pour cela vous devrez créer un compte sur le site https://www.themoviedb.org et créer une nouvelle clé en suivant les instructions de la documentation. Cette clé agit comme un mot de passe, on évitera de la mettre sur git.

## Modalités pédagogiques
**Points obligatoires**

* Le site sera réalisé en HTML5, CSS3 et JS ES6+
* Le site doit être responsive, respecté les règles d’accessibilité et optimisé pour le SEO
* Vous devez utiliser SASS pour la création de votre CSS
* Vous devez utiliser un framework CSS de votre choix
* Vous devez utiliser npm pour la gestion de vos dépendances
* Vous devez utiliser ESLint et StyleLint pour le style du code (notamment ES6)

_Points facultatifs_
Vous pouvez utiliser n’importe librairies JS ou CSS, tant qu’elles sont installées avec npm

## TMDB
Add your TMDB API KEY to ``src/config/key.ts`` file.
```ts
export const apiKey = "TMDB API KEY STRING";
```