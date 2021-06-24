const MAX_LEVEL = 4;
var LEVEL = 1;

document.body.onload = getMove;

function getMove(){  
    var move = getBestMove();      
    //document.body.innerHTML = `${move.row}${move.col}`;    
}

function getBestMove(){
    var state = getParameterByName("estado");
    var turn = getParameterByName("turno");
    //console.log(state);
    //console.log(turno);
    /* ----------- pruebas ------------- */
    /*
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
    */   
    /* ----------- fin pruebas ------------- */
    if (!state || !(turn == 1 || turn == 0)){
        return {row: "", col: ""};
    }

    var movesTree = {
        state: state,
        newState: state,
        turn: turn,
        nextTurn: 1        
    }
    //movesTree.nextMoves = getPossibleMoves(state, turn);
    
    LEVEL = 1;
    movsTree = getMovesTree(movesTree);    

    document.body.innerHTML = JSON.stringify(movsTree);
    //console.log("Estado:");
    //console.log(state);
    //console.log(`Posibles movimientos de ${turn}:`)
    /*
    console.log('Arbol de movimientos')
    console.log(movsTree);    
        
    if (movs.length > 0){        
        //movs.sort((m1, m2) => m2.heuristicaTablero - m1.heuristicaTablero);                
        //console.log(`Mejor movimiento:`);
        //console.log(movs[0]);
        return movs[0]
    }
    */
    return {row: "", col: ""};
}

function getMovesTree(move){        
    if (LEVEL < MAX_LEVEL){        
        console.log(`turno ${move.turn} -- level ${LEVEL}` )    
        move.nextMoves = getPossibleMoves(move.newState, move.nextTurn);
        LEVEL++;
        move.nextMoves.forEach(nextMove => {            
            getMovesTree(nextMove);
        });
        LEVEL--;
    }    
    return move;
}

function setCharAt(str, pos, chr){    
    return str.substring(0, pos) + chr + str.substring(pos + 1);
}

function getStateAfterMove(state, turn, mov){
    var indx = index(mov.row, mov.col);
    
    if (!isValidIndex(indx)){
        return;
    }
    //se coloca la pieza en la casilla 
    state = setCharAt(state, indx, turn);       
    
    //comer piezas del oponente

    var op = opponent(turn);
    
    var newState = state;

    var row = 0;
    var col = 0;
    var estadoActual;
    var c = 0;
    do{
        c++;
        estadoActual = newState;
        for (indx = 0; indx < newState.length; indx++){
            if (newState[indx] != turn){
                continue;
            }
    
            row = Math.floor(indx / 8);
            col = indx % 8;
            
            //se analiza la horizontal derecha    
            indx = index(row, col + 1);
            if (isValidIndex(indx)){
                //si hay un oponente a la derecha del espacio en blanco
                if (state[indx] == op){
                    //se escanea hacia la derecha hasta hallar una ficha del color del jugador actual en la fila actual
                    for (var j = col + 1; j < 8; j++){  
                        indx = index(row, j);    

                        if (state[indx] == turn){
                            state = newState;
                            break;
                        }else if (state[indx] == op){
                            newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                        }else{
                            newState = state;
                            break;
                        }
                    }
                    newState = state;
                }
            }
            
            //se analiza la horizontal izquierda
            indx = index(row, col - 1);
            if (isValidIndex(indx)){
                //si hay un oponente a la izquierda del espacio en blanco
                if (state[indx] == op){
                    //se escanea hacia la izquierda hasta hallar una ficha del color del jugador actual en la fila actual
                    for (var j = col - 1; j > -1; j--){
                        indx = index(row, j);       
                        if (state[indx] == turn){
                            state = newState;
                            break;
                        }else if (state[indx] == op){
                            newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                        }else{
                            newState = state;
                            break;
                        }
                    } 
                    newState = state;                   
                }
            }
    
            //se analiza la vertical inferior
            indx = index(row + 1, col);
            if (isValidIndex(indx)){
                //si hay un oponente hacia abajo del espacio en blanco
                if (state[indx] == op){
                    //se escanea hacia abajo hasta hallar una ficha del color del jugador actual en la fila actual
                    for (var i = row + 1; i < 8; i++){
                        indx = index(i, col);       
                        if (state[indx] == turn){
                            state = newState;
                            break;
                        }else if (state[indx] == op){
                            newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                        }else{
                            newState = state;
                            break;
                        }
                    }
                    newState = state;
                }
            }
    
            //se analiza la vertical superior
            indx = index(row - 1, col);
            if (isValidIndex(indx)){
                //si hay un oponente hacia arriba del espacio en blanco
                if (state[indx] == op){
                    //se escanea hacia arriba hasta hallar una ficha del color del jugador actual en la fila actual
                    for (var i = row - 1; i > -1; i--){
                        indx = index(i, col);       
                        if (state[indx] == turn){
                            state = newState;
                            break;
                        }else if (state[indx] == op){
                            newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                        }else{
                            newState = state;
                            break;
                        }
                    }
                    newState = state;
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
                        
                        if (isValidIndex(indx)){
                            if (state[indx] == turn){
                                state = newState;
                                break;
                            }else if (state[indx] == op){
                                newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                            }else{
                                newState = state;
                                break;
                            }
                        }                
                    }
                    newState = state;
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
                        
                        if (isValidIndex(indx)){
                            if (state[indx] == turn){
                                state = newState;
                                break;
                            }else if (state[indx] == op){
                                newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                            }else{
                                newState = state;
                                break;
                            }
                        }    
                    }
                    newState = state;
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
                        
                        if (isValidIndex(indx)){
                            if (state[indx] == turn){
                                state = newState;
                                break;
                            }else if (state[indx] == op){
                                newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                            }else{
                                newState = state;
                                break;
                            }
                        }    
                    }
                    newState = state;
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
                        
                        if (isValidIndex(indx)){
                            if (state[indx] == turn){
                                state = newState;
                                break;
                            }else if (state[indx] == op){
                                newState = setCharAt(newState, indx, turn);//reemplaza la ficha del oponente por la del jugador que movió
                            }else{
                                newState = state;
                                break;
                            }
                        }    
                    }
                    newState = state;
                }
            }
        }
        console.log(`c: ${c}`);
        //console.log(estadoActual);
        //console.log(newState);
    }while(newState !== estadoActual && c < 1000);

    
    return newState;
}

function getPossibleMoves(state, turn){
    var row = 0;
    var col = 0;
    var moves = [];

    for (var i = 0; i < state.length; i++){
        if (state[i] == 2){
            //console.log(`se hallo ${turn} en ${row},${col}`)    
            if (playable(state, row, col, turn)){
                var move = {
                    row: row,
                    col: col,
                    state: state,                    
                    turn: turn,
                    nextTurn: turn == 1 ? 0: 1,
                    heuristicaTablero: getHeuristica(row, col)
                };               
                move.newState =  getStateAfterMove(state, turn, move);
                moves.push(move);
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

function getHeuristica(row, col){
    var heuristicaTablero =  [
        [120, -20, 20, 5, 5, 20, -20, 120 ],
        [-20, -40, -5,-5,-5,-5,  -40,-20 ],
        [20,-5,15,3,3,15,-5,20],        
        [5,-5,3,3,3,3,-5,5],
        [5,-5,3,3,3,3,-5,5],        
        [20,-5,15,3,3,15,-5,20],
        [-20, -40, -5,-5,-5,-5,  -40,-20 ],
        [120, -20, 20, 5, 5, 20, -20, 120 ]
    ]
    return heuristicaTablero[row][col];
}