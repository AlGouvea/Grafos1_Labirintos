let labirinto = null;
let res = 50;

function setup(){

}

function draw(){

}

function geraLabirinto(w, h){
    labirinto = 
    {
      "stack":[],
      "blocos":[],
      "w":w,
      "h":h
    };
    
    for(let i = 0; i < w; i++)
    {
      labirinto.blocos[i] = [];
      for(let j = 0; j < h; j++)
      {
        labirinto.blocos[i][j] = 
        {
          "cima":"parede",
          "baixo":"parede",
          "esquerda":"parede",
          "direita":"parede",
          "isStart":false,
          "eAtual":false,
          "x":i,
          "y":j,
          "visto":false
        }
        if(i == 0 || i == w-1 || 
           j == 0 || j == h-1)
        {
          labirinto.blocos[i][j].visto = true;
        }
      }
    }
    
    labirinto.blocos[1][1].eAtual = true;
    labirinto.blocos[1][1].isStart = true;
    labirinto.blocos[1][1].visto = true;
    labirinto.stack.push(labirinto.blocos[1][1]);
}

function labirintoIterar(){
    let atual = labirinto.stack.pop();
  
    let blocoAndparede = pickNeighbor(atual);
    if(blocoAndparede)
    {
      labirinto.stack.push(atual);
      blocoAndparede.bloco[blocoAndparede.parede] = "open";
      atual[paredeOposta(
        blocoAndparede.parede)] = "open";
      blocoAndparede.bloco.visto = true;
      labirinto.stack.push(blocoAndparede.bloco);
      
      atual.eAtual = false;
      blocoAndparede.bloco.eAtual = true;
    }
    else if(labirinto.stack.length != 0)
    {
      atual.eAtual = false;
      labirinto.stack[
        labirinto.stack.length-1].eAtual = true;
    }
}

function pickVizinho(bloco){

}

function paredeOposta(parede){

}

function drawlabirinto(){

}

function drawbloco(bloco, i, j){

}