import { higher } from "./fragments.js";
import { lower } from "./fragments.js";
import {stringToHTML } from "./fragments.js";

export{setupRows};

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

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        showContent(content, guess)
    }
}
