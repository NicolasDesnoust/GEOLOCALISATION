#Geolocalisation

![Bannière](screenshots/banniere.png?raw=true "Bannière")

## Lancer l'application
Pour lancer l'application veuillez lancer le fichier home.html dans un navigateur.

## Decription des fonctionnalités
Cette application web codée majoritairement en Javascript est réalisée pour la Fondation de France. Elle permet essentiellement de gérer et visualiser des donateurs sur une carte.
Elle permet plus précisément de:
- Importer des donateurs sous forme de fichiers .csv.
![Import](screenshots/import.png?raw=true "Import")
- Filtrer ces derniers sur des critères textuels, numériques et booléens.
![Filtres](screenshots/filtres.png?raw=true "Filtres")
- Rechercher les donateurs proches d'une ville.
![Recherche](screenshots/recherche.png?raw=true "Recherche")
- Exporter les donateurs sélectionnés sous format .csv.
![Export](screenshots/export.png?raw=true "Export")

## Dernières nouveautés
- Recherche par ville/code postal avec fonctionnalité d'auto-complétion.
- Ajout d'un type de colonne supplémentaire identifiable (les booléens).
- Reformulation des opérateurs de comparaison lors de l'ajout de filtres pour qu'ils soient plus compréhensibles.
- Amélioration de l'affichage des pop-ups (hauteur maximale fixée, barre de défilement,
recentrage de la carte lors de l'ouverture).
- Prise en compte des guillemets double lors de l'import d'un fichier entourant des valeurs.
- Amélioration de la rapidité d'exécution des opérations d'import, de filtrage et de recherche.
- Correction de bugs.

## Conseils à lire avant utilisation
- Lors de l'import le séparateur par défaut est la virgule et le nom de colonne par défaut est "CP".
- Le logiciel n'explicite pas clairement les erreurs donc une utilisation prudente est recommandée.
- Lors de l'export le nom du fichier doit contenir l'extension .csv et le séparateur doit être renseigné.
- La recherche ne fonctionne que si le bon couple ville/code postal est écrit dans le champ textuel séparé
d'une virgule. Pour cela la fonctionnalité d'auto-complétion peut être utile.
- Pour filtrer sur les donateurs, il est possible de le faire de deux manières:
	- En ajoutant un filtre (bouton accessible depuis la fenêtre des filtres).
	- En ajoutant une contrainte supplémentaire à un filtre déjà existant (croix bleue à droite d'un filtre).
Pour qu'un donateur soit sélectionné il doit donc correspondre à au moins un des filtres. 
Correspondre à un filtre signifie correspondre à toutes ses contraintes.
