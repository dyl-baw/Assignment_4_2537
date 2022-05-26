// async function loadCards() {
//     await $.ajax({
//         type:"GET",
//         url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
//         success: processPokeImages
//     })
// }


hasFlippedCard = false;
lockBoard = false;
firstCard = undefined;
secondCard = undefined;
pairsFound = 0;

// const cards = document.querySelectorAll('.card');

// function flipCard() {
//   console.log('I was clicked');
//   console.log(this);
// }

// cards.forEach(card => card.addEventListener('click', flipCard));

function setup() {

    // loadCards();
    $(".card").on("click", function () {
        if(lockBoard) return;
        if(this == firstCard) return;
        if(!this.classList.contains("flip")){
        $(this).toggleClass("flip")

        if (!hasFlippedCard) {
            firstCard = $(this).find('.front_face')[0]
            hasFlippedCard = true;
        } else {
            // 2nd card
            secondCard = $(this).find('.front_face')[0]
            console.log(firstCard, secondCard);
            hasFlippedCard = false;
            checkForMatch();
        }
}})

    function checkForMatch() {
        // check if you have match
        if (
            $(`#${firstCard.id}`).attr("src") ==
            $(`#${secondCard.id}`).attr("src")
        ) {
            console.log("A Match!");
            pairsFound++;
            disableCards();

        } else {
            console.log("not a Match!");
            unflipCards();
        }
    }

    function disableCards() {
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            $(`#${firstCard.id}`).parent().removeClass("flip")
            $(`#${secondCard.id}`).parent().removeClass("flip")
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // (function shuffle(){
    //     let randomPosition = Math.floor(Math.random() * 12);
    //     $('.card').css("order", randomPosition);
    // })();
}

$(document).ready(setup)