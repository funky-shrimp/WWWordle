"use strict";
import Answer from "./Answer.js";

/*
- **Rôle :** Piloter la progression de la partie et gérer l’ensemble des tentatives.
- **Fonctionnalités :**
    - Maintenir l’état global (en cours, terminé, etc.).
    - Organiser et stocker un ensemble de tentatives.
    - Activer et désactiver la tentative courante selon l’avancement du jeu.
    - Déterminer si la partie doit continuer ou s’arrêter (par exemple, après le dernier essai).
    - Diffuser des messages d’information ou d’erreur à l’écran.
- **Interaction avec les autres modules :**
    - Crée plusieurs objets représentant les tentatives (depuis le module des tentatives `Answer.js`).
    - Reçoit des retours des tentatives (propositions, résultats) et gère la suite de la partie en conséquence.
    - Affiche des informations ou avertit en cas d’erreur au travers du DOM (sans s’occuper du détail de la saisie).
*/

class Game {
  #tries;
  #answers = [];
  #currentRow;

  constructor(tries, letters) {
    if(tries <= 0) throw new Error("Number of tries must be positive and above 0")
    this.#tries = tries;

    for (let i = 0; i < this.#tries; i++) {
      const answer = new Answer(this, i, letters);
      this.#answers.push(answer);
    }

    this.#answers[0].switchInert();
    this.#currentRow = this.#answers[0];
  }

  nextRow() {
    if(this.#tries == 0){
        this.displayMessage("Game Over")
        return
    }

    let currentRowIndex = this.#answers.findIndex(
      (row) => row === this.#currentRow
    );
    if (currentRowIndex < this.#answers.length - 1) {
      this.#currentRow.switchInert();
      this.#currentRow = this.#answers[currentRowIndex + 1];
      this.#currentRow.switchInert();
      console.log(this.#currentRow)
      this.#currentRow.focusOnFirstInput()
    }

    this.#tries
  }

  displayMessage(message) {
    if (message == "") throw new Error("Parameter can't be empty/null");
    const msgElement = document.querySelector(".message");
    msgElement.textContent = message;
  }
}

export default Game;
