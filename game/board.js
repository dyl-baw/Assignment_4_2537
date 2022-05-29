totalPokemon = 0;
loop = 0;
length, width = 0;
add = '';
grid = '2x2';
pokeList = [];
pokenum = '2';
randomNumber = 0;
sel_add = ''
counter = 1
result = ''
time = 60;


function processPokeResp(data) {
    add += `
    <div class="card" onclick="gameLogic()">
        <img id="img${loop}" class="front_face" src="${data.sprites.other["official-artwork"].front_default}" alt="">
        <img  class="back_face" src="img/pcardback.jpg" alt="">
    </div>`
    loop++;
}

function listOfPokemon() {
    pokeNeeded = length * width / 2; // Amount of matching pokemon needed. For Example on a 2x2 grid you need 2 pokemon cards to play the game.
    number = 0;
    if (pokenum == '2') {
        number = pokeNeeded
    } else {
        number = parseInt(pokenum)
    }

    for (i = 0; i < number; i++) {
        randomNumber = Math.floor(Math.random() * 898) + 1;
        pokeList.push(randomNumber)
    }
    repeatPoke = pokeNeeded - number //if player selected a 2x3 grid [6 cards] but chose only 2 pokemons to appear. We need to repeat some of the same ones.
    if (repeatPoke > 0) {
        for (i = 1; i <= repeatPoke; i++) {
            pokeList.push(pokeList[Math.floor(Math.random() * number)])
        }
    }
    for (i = 0; i < pokeNeeded; i++) {
        pokeList.push(pokeList[i])
    }
}

function shufflecards(list) { //This funcion is used to shuffle the cards.
    const array = list;
    var l = array.length,
        j, k;
    while (l) {
        // console.log(typeof j);
        j = Math.floor(Math.random() * l--);
        k = array[l]
        array[l] = array[j];
        array[j] = k;
    }
    return array;
}

async function loadCards() {
    totalPokemon = length * width;
    loop = 0;
    pokeList = [];
    listOfPokemon();
    array = shufflecards(pokeList);
    for (i = 1; i <= totalPokemon; i++) {
        loop = i
        if (i == 1) {
            add += `<div id="game_grid">`
        }
        // if (i % 2 == 1) {
        //     add += `<div class="grid">`
        // }
        try {
            await $.ajax({
                type: "get",
                url: `https://pokeapi.co/api/v2/pokemon/${array[i - 1]}`,
                success: processPokeResp
            })

            // if (i % 2 == 0) {
            //     add += `</div>`
            // }
            if (i == totalPokemon) {
                add += `</div">`
            }
        } catch (err) {
            if (err) {
                console.log("Error" + err);
            }
        }

        $("#game_grid").html(add)
    }
}


function settime() { //sets the timer 
    var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            document.getElementById("timer").innerHTML = "Lose";
            result = "Lose"
            // setgame();
        } else {
            document.getElementById("timer").innerHTML = timeleft;
        }

        // if ((pairsFound * 2 == list.length) && timeleft > 0 && counter == 1) {
        //     document.getElementById("timer").innerHTML = "Win"
        //     result = "Win"
        //     counter++
        //     // setgame()
        //     clearInterval(downloadTimer)

        // } else {
        //     
        // }
        timeleft -= 1;
    }, 1000);
}

function display() {
    $("#game_grid").empty()
    add = ''
    timeleft = 0;
    timeleft = time;
    var now = new Date(Date.now());
    var format = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    if (grid == "2x2") {
        length = 2;
        width = 2;
        loadCards();
    } else if (grid == "3x4") {
        length = 3;
        width = 4;
        loadCards();
    } else {
        length = 4;
        width = 4;
        loadCards();
    }
    settime(timeleft);
}


function display2() { // logic for choosing difficulty changes the timer
    if (difficulty == 'easy') {
        time = 60;
    } else if (difficulty == 'medium') {
        time = 45;
    } else {
        time = 30;
    }
}


function setup() {
    $("#game_grid").empty()

    $("#grid_type").change(() => {
        grid = $("#grid_type option:selected").val();
        console.log(grid);
        display2()
    });

    $("#difficulty").change(() => { // added the listener for changing difficulty.
        difficulty = $("#difficulty option:selected").val();
        console.log(difficulty);
        display2()
    })

    $("#numPokemon").change(() => {
        number = $("#numPokemon option:selected").val();
        console.log(number);
    })
    display2()
    loadCards();
}

$(document).ready(setup)