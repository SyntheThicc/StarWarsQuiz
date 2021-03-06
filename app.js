const wrapper = document.querySelector('.wrapper');
const lightsaberSound = document.querySelector('.ignite__sound');
const creditsSound = document.querySelector('.credits__sound');
const lightsaber = document.querySelector('.lightsaber');
const startBtn = document.querySelector('.btn__start');
const submitBtn = document.querySelector('.submit__btn');
const retryBtn = document.querySelector('.btn__retry');
const difficultyBtns = document.querySelectorAll('.difficulty__btn');
const form = document.querySelector('form');
const userInput = document.querySelector('input[type=text]');
const messageDisplay = document.querySelector('.message__display');
const imageContainer = document.querySelector('.img__container');
const img = document.querySelector('img');
const credits = document.querySelector('.credits');



class Quiz {
    constructor () {
        this.answers = ['Obi Wan Kenobi', 'Anakin Skywalker', 'Yoda', 'Mace Windu', 'Count Dooku', 'Darth Vader', 'General Grievous', 'Qui Gon Jinn', 'Luke Skywalker', 'Darth Maul', 'Emperor Palpatine', 'Kit Fisto', 'Bobba Fett', 'Ahsoka Tano', 'Han Solo', 'Princess Leia', 'Kylo Ren', 'Captain Phasma', 'Finn', 'Rey', 'C3PO', 'R2-D2', 'Padme Amidala', 'Lando Calrissian', 'General Hux', 'Chewbacca Wookie'];
        this.numberOfQuestions = 0;
        this.questionsArray;
        this.imageNumber;
        this.wrongAnswers = 0;
        this.correctAnswers = 0;
        this.setDifficulty();
        startBtn.addEventListener('click', this.checkDifficulty.bind(this));
        form.addEventListener('submit', this.processPlayersInput.bind(this));
    }

    setDifficulty() {
        difficultyBtns.forEach(diffBtn => {
            diffBtn.addEventListener('click', (e) => {
                let newNumber = 0;
                lightsaber.style.setProperty('--blade-color', e.target.dataset.color);
                diffBtn.style.setProperty('--btn-color', e.target.dataset.color);
                if (e.target.dataset.difficulty === 'hard') {
                    newNumber = this.answers.length;
                    this.numberOfQuestions = newNumber;
                } else {
                    newNumber = (this.answers.length) / Number(e.target.dataset.difficulty);
                    this.numberOfQuestions = newNumber;
                }
                this.generateArray();
            });
        });
    }

    checkDifficulty() {
        this.numberOfQuestions === 0 ?
            this.alertMsg('Please select difficulty before starting the game.', 1200)
            : this.loadGame();
    }

    loadGame() {
        wrapper.classList.add('hide__btns');
        lightsaber.style.display = 'flex';
        setTimeout(() => {
            wrapper.classList.add('saber__ignite');
            lightsaberSound.play();
        }, 200);
        let playtime = lightsaberSound.duration;
        playtime = (lightsaberSound.duration - 1) * 1000;
        setTimeout(() => {
            wrapper.classList.remove('saber__ignite');
        }, playtime);
        setTimeout(() => {
            lightsaber.style.display = 'none';
        }, playtime + 700);
        setTimeout(() => {
            this.updateImage();
            wrapper.classList.add('show__game');
        }, playtime + 1000);
    }

    processPlayersInput(e) {
        e.preventDefault();
        const answersLowercase = this.answers.map(answer => answer.toLowerCase());

        const playerGuess = userInput.value.toLowerCase();

        this.sliceImageSrc();


        if (!isNaN(playerGuess) || playerGuess === undefined) {
            this.alertMsg('Please enter a valid answer.', 1200);
            return;
        }

        if (answersLowercase.indexOf(playerGuess) === this.imageNumber) {
            this.renderAnswer('correct');
            setTimeout(() => {
                this.nextQuestion();
            }, 2400);
        }
        else {
            this.renderAnswer('wrong');
            setTimeout(() => {
                this.nextQuestion();
            }, 2400);
        }

        userInput.value = '';
    }

    renderAnswer(type) {
        submitBtn.disabled = true;
        imageContainer.classList.add('unblur');
        if (type === 'correct') {
            this.correctAnswers++;
            this.alertMsg('Your answer is correct!!', 2400, 'correct');
        } else if (type === 'wrong') {
            this.alertMsg(`Your answer is incorrect,correct answer was ${this.answers[this.imageNumber]}.`, 2400, 'wrong');
            this.wrongAnswers++;
        }
    };

    updateImage() {
        let randomNumber = this.questionsArray.pop();
        img.src = `answers/${randomNumber}.jpg`;
        setTimeout(() => {
            imageContainer.classList.remove('fade-in');
        }, 1500);
        submitBtn.disabled = false;
    }

    nextQuestion() {
        if (this.questionsArray.length === 0) {
            this.gameOver();
        } else {
            imageContainer.classList.add('fade-in');
            imageContainer.classList.remove('unblur');
            submitBtn.disabled = false;
            this.updateImage();
        }
    }

    gameOver() {
        creditsSound.play();
        wrapper.classList.remove('show__game');
        credits.innerHTML = ` Congratulations,You finished the quiz!<br>
        You had ${this.correctAnswers} correct ${this.correctAnswers === 1 ? 'answer' : 'answers'},
        and ${this.wrongAnswers} wrong ${this.wrongAnswers === 1 ? 'answer' : 'answers'}! <br />
        Thank you for playing, and may the force be with you!`;
        wrapper.classList.add('roll__credits');
        setTimeout(() => {
            retryBtn.style.display = 'block';
            retryBtn.addEventListener('click', function () {
                location.reload();
            });
        }, 9000);
    }

    generateArray() {
        this.questionsArray = [];
        let startingArray = this.answers
            .map((_, i) => i)
            .sort(function () {return 0.5 - Math.random();});
        for (let i = 0; i <= this.numberOfQuestions - 1; i++) {
            this.questionsArray.push(startingArray.pop());
        }

    }

    sliceImageSrc() {
        this.imageNumber = Number(img.src
            .toString()
            .substring(
                img.src.lastIndexOf('/') + 1,
                img.src.lastIndexOf('.')
            ));
    }

    alertMsg(text, time, cls) {
        messageDisplay.textContent = text;
        messageDisplay.classList.add(cls);
        setTimeout(() => {
            messageDisplay.textContent = '';
            messageDisplay.classList.remove(cls);
        }, time);
    }
}

const StarWarsQuiz = new Quiz();