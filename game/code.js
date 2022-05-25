
// async function loadCards() {
//     await $.ajax({
//         type:"GET",
//         url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
//         success: processPokeImages
//     })
// }


hasFlippedCard = false;

firstCard = undefined;
secondCard = undefined;

// const cards = document.querySelectorAll('.card');

// function flipCard() {
//   console.log('I was clicked');
//   console.log(this);
// }

// cards.forEach(card => card.addEventListener('click', flipCard));

function setup() {

    // loadCards();
    $(".card").on("click", function () {
        $(this).toggleClass("flip")

        if(!hasFlippedCard){
            // this is the first card
            firstCard = $(this).find('.front_face')[0]
            // console.log(firstCard);
            hasFlippedCard = true;
        }else{
            // 2nd card
            secondCard =  $(this).find('.front_face')[0]
            console.log(firstCard, secondCard);
            hasFlippedCard = false;

            // check if you have match
            if (
                $(`#${firstCard.id}`).attr("src")
                ==
                $(`#${secondCard.id}`).attr("src")
            ) {
                console.log("A Match!");
                $(`#${firstCard.id}`).parent().off("click")
                $(`#${secondCard.id}`).parent().off("click")
            } else {
                console.log("not a Match!");
                setTimeout( () => {
                    $(`#${firstCard.id}`).parent().removeClass("flip")
                    $(`#${secondCard.id}`).parent().removeClass("flip")
                }, 1000);

            }
        }
    })
}

$(document).ready(setup)