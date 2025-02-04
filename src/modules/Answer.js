"use strict";

import Game from "./Game.js";

/*
- **Rôle :** Gérer la saisie d’une proposition par l’utilisateur pour un essai précis (une ligne du jeu).
- **Fonctionnalités :**
    - Générer et insérer un formulaire de saisie (un ensemble de champs pour la proposition).
    - Permettre la navigation intuitive dans les champs (déplacement automatique du focus).
    - Vérifier la validité de la saisie (longueur, caractères autorisés).
    - Envoyer la proposition au serveur et traiter la réponse (colorisation, affichage du résultat).
    - Alterner entre un état actif et inactif, selon la progression du jeu.
- **Interaction avec les autres modules :**
    - Est créé et géré par le module du jeu (chaque partie possède un certain nombre de tentatives).
    - Informe le jeu des résultats après validation (pour savoir si l’essai est correct ou non).
    - Peut déclencher un message d’erreur ou de victoire, mais l’affichage final est géré par le jeu.

*/

class Answer {
  static #API_URL = "https://progweb-wwwordle-api.onrender.com/guess";
  #form = document.createElement("form");
  #game;
  #LETTERS;

  constructor(game, rowNumber, letters) {
    if (!(game instanceof Game))
      throw new Error("game must be instance of Game Class");
    if (rowNumber < 0) throw new Error("rowNumber can't be negative");

    this.#game = game;
    this.#LETTERS = letters;

    this.#form.classList.add("row");
    this.#form.id = `row-${rowNumber}`;
    this.#form.inert = "true";

    for (let i = 0; i < this.#LETTERS; i++) {
      const input = document.createElement("input");
      input.classList.add("letter");
      input.type = "text";
      input.name = `letter-${i}`;
      input.id = `${this.#form.id}--${i}`;
      input.maxLength = 1;

      input.addEventListener("keyup", (e) => {
        let currentNumber = +e.target.id.slice(-1);
        let focusId = e.target.id.slice(0, -1);
        if (Answer.#isAlphaNumericKey(e.key) || e.key == "ArrowRight") {
          const nextFocus = document.querySelector(
            `input[id="${focusId + (currentNumber + 1)}"`
          );
          if (nextFocus) nextFocus.focus();
        } else if (e.key == "ArrowLeft") {
          const nextFocus = document.querySelector(
            `input[id="${focusId + (currentNumber - 1)}"`
          );
          if (nextFocus) nextFocus.focus();
        }
      });

      this.#form.append(input);
    }

    const submitInput = document.createElement("input");
    submitInput.type = "submit";
    submitInput.hidden = "true";

    this.#form.append(submitInput);

    this.#form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(this.#form);

      let userAnswer = "";
      for (const letters of formData.values()) {
        userAnswer += letters;
      }

      if (!Answer.#isAlphaNumeric(userAnswer)) {
        this.#game.displayMessage("Answer must contain only letter, fool !");
      } else if (userAnswer.length < this.#LETTERS) {
        this.#game.displayMessage(
          `Answer must be ${this.#LETTERS} letters long, punk !`
        );
      } else {
        const data = await Answer.#submitUserAnswer(userAnswer);

        console.log(data);
        this.#game.displayMessage(data.message);
        if (data.status == "invalid") return;

        this.colorLetters(data.feedback);
        if (Answer.#isCorrectAnswer(data.feedback, this.#LETTERS)) {
          this.#game.displayMessage("Congratulations ! You found the word, Champ !")
          this.#form.switchInert()
        }else{
          this.#game.nextRow()
        }
      }
    });

    document.querySelector("main[class='board']").append(this.#form);
  }

  colorLetters(feedback) {
    let index = 0;
    feedback.forEach((letter) => {
      const input = this.#form.querySelector(`input[name=letter-${index}]`);
      let color = "";
      switch (letter.status) {
        case "correct":
          color = "green";
          break;
        case "present":
          color = "yellow";
          break;
        default:
          color = "grey";
      }
      input.style.backgroundColor = color;
      index++;
    });
  }

  switchInert() {
    if(this.#form.inert) {
      this.#form.removeAttribute("inert")
    }else{
      this.#form.inert="true"
    }
  }

  focusOnFirstInput(){
    this.#form[0].focus;
  }

  static #isAlphaNumericKey(key) {
    return /^([\x30-\x39]|[\x61-\x7a])$/i.test(key);
  }

  static #isAlphaNumeric(word) {
    return /^[a-zA-Z]+$/.test(word);
  }

  static async #submitUserAnswer(userAnswer) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess: userAnswer }),
    };

    const res = await fetch(Answer.#API_URL, options);
    const data = await res.json();

    return data;
  }

  static #isCorrectAnswer(feedback, letters) {
    return feedback.filter((letter)=>letter.status=="correct").length == letters
  }
}

export default Answer;
