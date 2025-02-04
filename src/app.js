"use strict";
import Game from "./modules/Game.js";

/*
- **Rôle :** Point d’entrée du programme, il orchestre le lancement du jeu.
- **Fonctionnalités :**
    - Créer et initialiser le jeu avec un nombre déterminé de tentatives.
    - Assurer la mise en place de la partie dès le chargement de la page.
- **Interaction avec les autres modules :**
    - Importe le module du `Game.js` pour l’instancier (en lui passant le nombre de tentatives).
    - Ne contient pas de logique spécifique au fonctionnement des tentatives ; délègue cette responsabilité au jeu.
*/

const game = new Game(5, 5);


