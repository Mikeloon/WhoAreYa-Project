import { higher } from "./fragments.js";
import { lower } from "./fragments.js";
import {stringToHTML } from "./fragments.js";
export{setupRows};
import { initState } from "./stats.js";

const leagues = [
    {
        "id" : 564,
        "cod" : "es1"
    },
    {
        "id" : 82,
        "cod" : "de1"
    },
    {
        "id" : 384,
        "cod" : "it1"
    },
    {
        "id" : 301,
        "cod" : "fr1"
    },
    {
        "id" : 8,
        "cod" : "en1"
    },
]

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


let setupRows = function (game) {


    const situacion = {
        "guesses" : [],
        "solution" : game.solution[0].id
    }

    localStorage.setItem('WAYgameState',JSON.stringify(situacion));
    
    let [state, updateState] = initState('WAYgameState', game.solution[0].id)

    

    function leagueToFlag(leagueId) {
        let liga = leagues.filter(lig => lig.id == leagueId);
        return liga[0].cod;
    }


    function getAge(dateString) {
        const diffMs = new Date() - new Date(dateString);
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    
    let check = function (theKey, theValue) {
        if(theKey == 'birthdate'){
            let edadesperada = getAge(game.solution[0].birthdate);
            let edadintroducida = getAge(theValue);
            if(edadesperada == edadintroducida) return 'correct';
            else if (edadesperada < edadintroducida) return 'lower';
            else return 'higher'
        }
        else{
            let i = attribs.findIndex(a =>{ return a == theKey;});
            let atrib = attribs[i];
            if(game.solution[0].atrib == theValue) return 'correct';
            else return 'incorrect';
        }
    }

        function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution[0].name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }


    function setContent(guess) {
        let birth = check('birthdate',guess.birthdate);
        let info;
        if (birth == 'correct') info = getAge(guess.birthdate);
        else if(birth == 'lower')info = `${getAge(guess.birthdate)} ${lower}`
        else info = info = `${getAge(guess.birthdate)} ${higher}`
        return [
            `<img src="https://playfootball.games/who-are-ya/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${info}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }


    function resetInput(){
        let local = JSON.parse(localStorage.getItem("WAYgameState"))
        document.getElementById("myInput").value = "";
        document.getElementById("myInput").placeholder = "Guess "+local.guesses.length +" OF 8"
    }

    let getPlayer = function (playerId) {
        let jugador = {};
            game.players.filter(jug => {
                if (jug.id == playerId) {
                  jugador.id = jug.id;
                  jugador.name = jug.name;
                  jugador.birthdate = jug.birthdate;
                  jugador.nationality = jug.nationality;
                  jugador.teamId = jug.teamId;
                  jugador.position = jug.position;
                  jugador.number = jug.number;
                  jugador.leagueId = jug.leagueId;
            }})
            return jugador;  
    }


    function gameEnded(lastGuess){
        let local = JSON.parse(localStorage.getItem("WAYgameState"))
        if(local.solution == lastGuess) return true;
        if(local.guesses.length == 8 && game.solution[0].id != lastGuess) return true;
        else return false;
    }


    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        function success(){
            unblur('success');
        }

        function gameOver(){
            unblur('fail');
        }

         if (gameEnded(playerId)) {
            // updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }
         }


        showContent(content, guess)
    }
}
