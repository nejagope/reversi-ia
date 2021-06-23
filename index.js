
document.body.onload = getMove;

function getMove(){  
    var move = getBestMove();      
    document.body.innerHTML = `${move[0]}${move[1]}`;
}

function getBestMove(){
    var state = getParameterByName("estado");
    var turn = getParameterByName("turno");
    //console.log(state);
    //console.log(turno);
    /* ----------- pruebas ------------- */
    state = `22222222 
             22222222 
             22222222 
             22210222 
             22201222 
             22222222 
             22222222 
             22222222`;

    turn = 1;

    state = state.replace(/\n/g, '');
    state = state.replace(/ /g, '');    
    /* ----------- fin pruebas ------------- */

    var movs = getPosibleMoves(state, turn);
    console.log(`Posibles movimientos de ${turn}:`)
    console.log(movs);
    var rnd = gentRand(0, movs.length - 1);
    console.log(rnd);
    if (movs.length > 0)
        return movs[rnd]
    return ["", ""];
}

function getPosibleMoves(state, turn){
    var row = 0;
    var col = 0;
    var moves = [];

    for (var i = 0; i < state.length; i++){
        if (state[i] == 2){
            //console.log(`se hallo ${turn} en ${row},${col}`)    
            if (playable(state, row, col, turn)){
                moves.push([row, col]);
            }
        }
        
        col++;
        if (col == 8){
            col = 0;
            row ++;
        }
    }
    return moves;
}

function playable(state, row, col, turn){    
    var indx = index(row, col);
    //es un índice valido?
    if (!isValidIndex(indx))
        return false;

    //condición 1: casilla vacía
    var playable = state[indx] == 2;
    if (!playable)
        return false;
        
    //condición 2: flanquea al adversario
    var op = opponent(turn);
    
    //se analiza la horizontal derecha
    indx = index(row, col + 1);
    if (isValidIndex(indx)){
        //si hay un oponente a la derecha del espacio en blanco
        if (state[indx] == op){
            //se escanea hacia la derecha hasta hallar una ficha del color del jugador actual en la fila actual
            for (var j = col + 1; j < 8; j++){                
                if (state[index(row, j)] == turn)
                    return true;
            }
        }
    }
    
    //se analiza la horizontal izquierda
    indx = index(row, col - 1);
    if (isValidIndex(indx)){
        //si hay un oponente a la izquierda del espacio en blanco
        if (state[indx] == op){
            //se escanea hacia la izquierda hasta hallar una ficha del color del jugador actual en la fila actual
            for (var j = col - 1; j > -1; j--){
                if (state[index(row, j)] == turn)
                    return true;
            }
        }
    }

    //se analiza la vertical inferior
    indx = index(row + 1, col);
    if (isValidIndex(indx)){
        //si hay un oponente hacia abajo del espacio en blanco
        if (state[indx] == op){
            //se escanea hacia abajo hasta hallar una ficha del color del jugador actual en la fila actual
            for (var i = row + 1; i < 8; i++){
                if (state[index(i, col)] == turn)
                    return true;
            }
        }
    }

    //se analiza la vertical superior
    indx = index(row - 1, col);
    if (isValidIndex(indx)){
        //si hay un oponente hacia arriba del espacio en blanco
        if (state[indx] == op){
            //se escanea hacia arriba hasta hallar una ficha del color del jugador actual en la fila actual
            for (var i = row - 1; i > -1; i--){
                if (state[index(i, col)] == turn)
                    return true;
            }
        }
    }

    //se analiza la diagonal derecha superior
    indx = index(row - 1, col + 1);
    if (isValidIndex(indx)){
        //si hay un oponente hacia arribba y a la derecha del espacio en blanco
        if (state[indx] == op){
            //se escanea la diagonal hasta hallar una ficha del color del jugador actual en la fila actual
            var i = row;
            for (var j = col + 1; j < 8; j++){
                i--;
                indx = index(i, j);
                if (isValidIndex){
                    if (state[index(i, j)] == turn)
                        return true;
                }                                
            }
        }
    }

    //se analiza la diagonal derecha inferior
    indx = index(row + 1, col + 1);
    if (isValidIndex(indx)){
        //si hay un oponente hacia arribba y a la derecha del espacio en blanco
        if (state[indx] == op){
            //se escanea la diagonal hasta hallar una ficha del color del jugador actual en la fila actual
            var i = row;
            for (var j = col + 1; j < 8; j++){
                i++;
                indx = index(i, j);
                if (isValidIndex){
                    if (state[index(i, j)] == turn)
                        return true;
                }                                
            }
        }
    }

    //se analiza la diagonal izquierda superior
    indx = index(row - 1, col - 1);
    if (isValidIndex(indx)){
        //si hay un oponente hacia arribba y a la derecha del espacio en blanco
        if (state[indx] == op){
            //se escanea la diagonal hasta hallar una ficha del color del jugador actual en la fila actual
            var i = row;
            for (var j = col - 1; j > -1; j--){
                i--;
                indx = index(i, j);
                if (isValidIndex){
                    if (state[index(i, j)] == turn)
                        return true;
                }                                
            }
        }
    }

    //se analiza la diagonal izquierda inferior
    indx = index(row + 1, col - 1);
    if (isValidIndex(indx)){
        //si hay un oponente hacia arribba y a la derecha del espacio en blanco
        if (state[indx] == op){
            //se escanea la diagonal hasta hallar una ficha del color del jugador actual en la fila actual
            var i = row;
            for (var j = col - 1; j > -1; j--){
                i++;
                indx = index(i, j);
                if (isValidIndex){
                    if (state[index(i, j)] == turn)
                        return true;
                }                                
            }
        }
    }

    return false;
}

function isValidIndex(index){
    return index >= 0 && index <= 63;
}

function index(row, col){
    return row * 8 + col;    
}

function opponent(turn){
    if (turn == 0)
        return 1;
    else 
        return 0; 
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function gentRand(min, max){    
    return Math.floor(Math.random() * (max - min)) + min
}