export {initState}

let initState = function(what, solutionId) { 
    let resultado = [];

    let primerapos = JSON.parse(localStorage.getItem(what));
    console.log(primerapos);
    let anonimo = function(guess){
        primerapos.guesses.push(guess);
        localStorage.setItem(what,JSON.stringify(primerapos));
    }
    resultado.push(primerapos);
    resultado.push(anonimo);
    return resultado;
}



