/*
 * Create a list that holds all of your cards
 */
 const cards = ['fa-diamond', 'fa-diamond',
               'fa-paper-plane-o', 'fa-paper-plane-o',
               'fa-anchor', 'fa-anchor',
               'fa-bolt', 'fa-bolt',
               'fa-cube', 'fa-cube',
               'fa-leaf', 'fa-leaf',
               'fa-bomb', 'fa-bomb',
               'fa-bicycle', 'fa-bicycle'
               ];

function generateCard(cardType) {
  const card = document.createElement('li');
  card.setAttribute('class', 'card');
  card.setAttribute('data-card', cardType);
  card.innerHTML = `<i class='fa ${cardType}'></i>`;
  return card;
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 const cardDeck = document.querySelector('.deck');
 const movesCounter = document.querySelector('.moves');
 let moves = 0;

 function initGame() {
   const fragment = document.createDocumentFragment();
   shuffle(cards);
   for (const card of cards) {
     const newCard = generateCard(card);
     fragment.appendChild(newCard);
   }

   cardDeck.appendChild(fragment);
   movesCounter.textContent = moves;
 }

 initGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const stars = document.querySelector('.stars');
const time = document.querySelector('.time');
let clickCounter = 0;
let openCards = [];
let matchedCards = [];
let starsLost = 0;
let seconds = 0;
let minutes = 0;
let timer = 0;

function addTime() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  time.textContent = `${(minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00')}:${(seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00')}`;
}

const modal = document.querySelector('#modal');
const stats = document.querySelector('.stats');

modal.addEventListener('click', function(evt) {
  if (evt.target.nodeName === 'DIV') {
    if (evt.target.classList.contains('close')) {
      modal.style.display = 'none';
    }
  } else if (evt.target.nodeName === 'BUTTON') {
    if (evt.target.classList.contains('yes')) {
      modal.style.display = 'none';
      resetGame();
    } else {
      modal.style.display = 'none';
    }
  }
});

function startTimer() {
  timer = setInterval(addTime, 1000);
}

function displayCard(card) {
  card.classList.add('show', 'open');
}

function addCardToOpenList(card) {
  openCards.push(card);
}

function keepCardsOpen(card) {
  card.classList.add('match');
  card.classList.remove('show', 'open');
}

function closeCard(card) {
  card.classList.remove('show', 'open');
}

function updateMoves() {
  moves++;
  movesCounter.textContent = moves;
}

cardDeck.addEventListener('click', function(evt) {
  if (evt.target.nodeName === 'LI') {
    if (!evt.target.classList.contains('show') && !evt.target.classList.contains('open') && !evt.target.classList.contains('match')) {
      if (openCards.length < 2) {
        clickCounter++;
        //Starts timer when first card is clicked
        if (clickCounter === 1) {
          startTimer();
        }

        addCardToOpenList(evt.target);
        displayCard(evt.target);

        if (openCards.length === 2) {
          //Keep cards open if they match
          if (openCards[0].dataset.card === openCards[1].dataset.card) {
            for (const card of openCards) {
              keepCardsOpen(card);
              matchedCards.push(card);
            }

            openCards = [];
          } else {
            //Close cards if they don't match
            setTimeout(function() {
              for (const card of openCards) {
                closeCard(card);
              }

              openCards = [];
            }, 700);
          }

          updateMoves();

          //A star is lost after a certain number of moves
          switch (moves) {
            case 12:
              stars.removeChild(stars.firstElementChild);
              starsLost++;
              break;
            case 15:
              stars.removeChild(stars.firstElementChild);
              starsLost++;
            break;
          }

          //Display message when all cards are matched
          if (matchedCards.length === 16) {
            clearInterval(timer);
            stats.textContent = `You completed the game in ${time.textContent} with ${moves} moves and ${3 - starsLost} stars remaining.`;
            modal.style.display = 'block';
          }
        }
      }
    }
  }
});

function generateStar(num) {
  for (let i = 0; i < num; i++) {
    const starSymbol = document.createElement('li');
    starSymbol.innerHTML = '<i class="fa fa-star"></i>';
    stars.appendChild(starSymbol);
  }
}

const reset = document.querySelector('#reset');
function resetGame() {
  generateStar(starsLost);
  starsLost = 0;
  moves = 0;
  clickCounter = 0;
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  timer = 0;
  matchedCards = [];
  time.textContent = '0:00';
  cardDeck.innerHTML = '';
  initGame();
}

reset.addEventListener('click', resetGame);
