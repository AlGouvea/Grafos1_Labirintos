//Definicoes
let labirinto = null;
let labirintoSolve = null;
let res = 40;
flag = 0;

//Botao para chamada da funcao resolver
var btn = document.getElementById("Resolver");

btn.addEventListener('click', function resolver(){ //Cria o event listener do click do botao
  //Se labirinto nao tiver resolvido
  if(flag == 1){
    //Configura o grafo pra resolucao
    setupGraph();

    //Atualiza o Labirinto como resolvido
    flag = 2;

    //Altera botao para a geracao de outro labirinto
    btn.textContent = "Gerar Outro";
    btn.style.backgroundColor = "blue";
  }else if(flag == 2){//Se labirinto tiver resolvido
    //Carrega novo labirinto
    //Definicoes
    var context  = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Reseta valores
    labirinto = null;
    labirintoSolve = null;
    flag = 0;

    btn.style.visibility = "hidden";
    btn.textContent = "Resolver";
    btn.style.backgroundColor = "green";      

    //Chama o setup
    setup();
  }
});


//Funcao de configuracao para gerar o labirinto
function setup(){

    //Criar o canvas do labirinto
    var canvas = createCanvas(800, 800); 
    canvas.style.marginLeft = "800px";
    noStroke();
    
    //Chamar funcao com largura e altura definidos
    geraLabirinto(width/res + 2, height/res + 2);
    
    //Se nao tiver acabado, desenha na tela
    if(flag == 0){
      drawlabirinto();
    }
}

//Funcao de configuracao do grafo de resolucao
function setupGraph(){

  labirintoSolve = {
    "nodes": [],
  }

  if(flag == 1){
    var nVertices = 0;
    for(var i = 1; i <= 800/res; i++){
      for(var j = 1; j <= 800/res; j++){
        labirintoSolve.nodes[nVertices] = {
          "edges": [],
          "valor": 0,
          "coords":[],
          "visitado":false,
        }

        labirintoSolve.nodes[nVertices].valor = nVertices;

        //Criar aresta entre blocos que nao tem parede
        if(labirinto.blocos[i][j].cima == "open"){
          labirintoSolve.nodes[nVertices].edges.push(nVertices-1);
        }
        if(labirinto.blocos[i][j].direita == "open"){
          labirintoSolve.nodes[nVertices].edges.push(nVertices+(800/res));
        }
        if(labirinto.blocos[i][j].baixo == "open"){
          labirintoSolve.nodes[nVertices].edges.push(nVertices+1);
        }
        if(labirinto.blocos[i][j].esquerda == "open"){
          labirintoSolve.nodes[nVertices].edges.push(nVertices-(800/res));
        }
        labirintoSolve.nodes[nVertices].coords = [i, j];
        nVertices++;
      }
    }

    visited = new Set();//Vetor de blocos visitados 
    DFS(0, nVertices-1, visited); //Chama a DFS
  }
  exit();//Saida
}


function DFS(start, exit, visited){
  visited.add(start);//Adiciona o bloco aos visitados

  const edges = labirintoSolve.nodes[start].edges;//Lista de adjacencia
  var print = 0;//Se o bloco vai ser ou nao printado

  for(const dest of edges){//Passa pelas arestas
    if(dest == exit){//Se o vizinho for a saida
      return 1;//Retorna 1
    }

    if(!visited.has(dest)){//Se nao for a saida e vizinho nao foi visitado
      print = DFS(dest, exit, visited);//Chamo a DFS com o vizinho

      if(print == 1){//Se print = 1 dabemos que faz parte da rota de resolucao
        drawSolve(labirintoSolve.nodes[dest]);//Desenha o bloco da rota
        return 1;//Passa a informacao pro resto da rota
      }

    }
  }
}


function drawSolve(node){//Desenhar o bloco
  var i = node.coords[0]-1;
  var j = node.coords[1]-1;
  
  noStroke()

  fill("green");//Pintar de branco

    //Definir quadrado
    square(i*res, j*res, res);
    
    //Grossura e cor da parede
    strokeWeight(3);
    stroke("black");


    //Pintar as bordas do bloco que tem parede
    var valor = node.valor;

    if(!node.edges.includes(valor-1)){//Cima
      line((i)*res, (j)*res, (i+1)*res, (j)*res);
    }
    if(!node.edges.includes(valor+(800/res))){//Direita
      line((i+1)*res, (j)*res, (i+1)*res, (j+1)*res);
    }
    if(!node.edges.includes(valor+1)){//Baixo
      line((i)*res, (j+1)*res, (i+1)*res, (j+1)*res);
    }
    if(!node.edges.includes(valor-(800/res))){//Esquerda
      line((i)*res, (j)*res, (i)*res, (j+1)*res);
    }
}


//Funcao para sair do loop do 
function exit(){
  //Deixa o botao de "Resolver" visivel
  btn.style.visibility = "visible";
}

//Se labirinto nao estiver pronto
if(flag == 0){
  let count = 0;//count para taxa de atualizacao da tela

  function draw(x, y){//Funcao que desenha na tela
    if(flag == 0){
      if(count % 1 == 0){
        //Se o labirinto nao estiver pronto
        if(labirinto.stack.length != 0){
          background("grey");//Cor do fundo
          labirintoIterar();
          drawlabirinto();
        }else{
          //Se labirinto e encontrado pronto pela primeira vez
          if(flag == 0){
            //Avisa o usuario e atualiza a flag
            alert("Labirinto Pronto!");
            flag = 1;
          }
  
          //Funcao de saida
          exit();
        }
      }
    }else{
      
    }
    count++;
  }


  //Funcao de gerar o labirinto
  function geraLabirinto(w, h){
    //Definicao do objeto labirinto
    labirinto = {
      "stack":[],
      "blocos":[],
      "w":w,
      "h":h
    };
    
    //Percorrer a matriz toda
    for(let i = 0; i < w; i++){
      //Definir .blocos como matriz
      labirinto.blocos[i] = [];

      for(let j = 0; j < h; j++){
        labirinto.blocos[i][j] = { //Definicao do objeto bloco
          //Definir cada direcao como inicialmente tendo parede
          "cima":"parede", 
          "baixo":"parede",
          "direita":"parede",
          "esquerda":"parede",

          //Nao eh o bloco atual nem o inicial
          "isStart":false,
          "eAtual":false,
          
          //Coordenadas
          "x":i,
          "y":j,

          //Nao foi visitado
          "visto":false
        }
        if(i == 0 || i == w-1 || j == 0 || j == h-1){
          //Definir as bordas como visitados
          labirinto.blocos[i][j].visto = true;
        }
      }
    }
    
    //Iniciar a geracao a partir do bloco [1][1]
    labirinto.blocos[1][1].eAtual = true; //Eh o atual
    labirinto.blocos[1][1].isStart = true; //Eh o inicial
    labirinto.blocos[1][1].visto = true; //Foi visto
    labirinto.stack.push(labirinto.blocos[1][1]); //Coloca no stack do labirinto
  } 

  //Funcao para percorrer o canvas iterativamente
  function labirintoIterar(){
      let atual = labirinto.stack.pop(); //Atual eh tirado do stack
    
      let blocoAndparede = pickVizinho(atual);//Escolho um vizinho aleatoriamente
      
      if(blocoAndparede){
        labirinto.stack.push(atual);//Atual colocado no stack pra retornar depois
        blocoAndparede.bloco[blocoAndparede.parede] = "open";//Vizinho e atual nao tem parede
        atual[paredeOposta(blocoAndparede.parede)] = "open";//Vizinho e atual nao tem parede
        //Vizinho eh visitado
        blocoAndparede.bloco.visto = true;
        labirinto.stack.push(blocoAndparede.bloco); //Vizinho adicionado ao stack
        
        atual.eAtual = false;//Atual nao eh mais atual
        blocoAndparede.bloco.eAtual = true;//Vizinho vira atual
      }else if(labirinto.stack.length != 0){//Sem vizinho disponivel e nada no stack
        atual.eAtual = false; //atual nao eh mais atual
        labirinto.stack[labirinto.stack.length-1].eAtual = true;//Volta pro ultimo elemento do stack
      }
  }

  //Funcao de escolha do vizinho
  function pickVizinho(bloco){
      let nao_visto = [];
    
      let cimabloco = labirinto.blocos[bloco.x][bloco.y+1]; //Vizinho de cima eh igual as coordenadas
      if(!cimabloco.visto){ //Nao foi visto
        nao_visto.push({ //Colocado como nao visitado
          "bloco":cimabloco, //coordenadas do vizinho sao passadas
          "parede":"cima" //Parede no lado oposto ao bloco original
        });
      }

      //Mesma coisa para o de baixo
      let baixobloco = labirinto.blocos[bloco.x][bloco.y-1];
      if(!baixobloco.visto)
      {
        nao_visto.push({
          "bloco":baixobloco,
          "parede":"baixo"
        });
      }

      //Mesma coisa para o da esquerda
      let esquerdabloco = labirinto.blocos[bloco.x+1][bloco.y];
      if(!esquerdabloco.visto)
      {
        nao_visto.push({
          "bloco":esquerdabloco,
          "parede":"esquerda"
        });
      }

      //Mesma coisa para o da direita
      let direitabloco = labirinto.blocos[bloco.x-1][bloco.y];
      if(!direitabloco.visto)
      {
        nao_visto.push({
          "bloco":direitabloco,
          "parede":"direita"
        });
      }
      
      //Todos ja foram visitados
      if(nao_visto.length == 0){
        return null;
      }
      

      return nao_visto[Math.floor(Math.random()*nao_visto.length)]; //retorna viziho disponivel aleatorio
  }

  function paredeOposta(parede){ //retorna parede oposta
      if(parede == "cima"){
        return "baixo"
      }else if(parede == "baixo"){
        return "cima"
      }else if(parede == "esquerda"){
        return "direita"
      }else if(parede == "direita"){
        return "esquerda"
      }
      
      return -1;
  }

  function drawlabirinto(){//Desenha o labirinto
      translate(-res, -res); //retira as bordas da area visivel
      for(let i = 0; i < labirinto.blocos.length; i++){
        for(let j = 0; j < labirinto.blocos[i].length; j++){//Para todo a "matriz" do labirinto
          let bloco = labirinto.blocos[i][j];
          drawbloco(bloco, i, j);//Desenha o bloco na coordenada
        }
      }
  }

  function drawbloco(bloco, i, j){//Desenhar o bloco
      strokeWeight(1);
      stroke("#ababab");
    
      if(bloco.visto == true){//Se o bloco foi visitado
        fill("white");//Pintar de branco

        //Se for o primeiro ou o ultimo pintar de vermelho
        if(i == 1 && j == 1){
          fill("red");
        }else if(i == 800/res && j == 800/res){
          fill("red");
        }

        //Definir quadrado
        square(i*res, j*res, res);
        
        //Grossura e cor da parede
        strokeWeight(3);
        stroke("black");


        //Pintar as bordas do bloco que tem parede
        if(bloco.cima == "parede"){
          line((i)*res, (j)*res, (i+1)*res, (j)*res);
        }
        if(bloco.baixo == "parede"){
          line((i)*res, (j+1)*res, (i+1)*res, (j+1)*res);
        }
        if(bloco.direita == "parede"){
          line((i+1)*res, (j)*res, (i+1)*res, (j+1)*res);
        }
        if(bloco.esquerda == "parede"){
          line((i)*res, (j)*res, (i)*res, (j+1)*res);
        }
      }

      //Se for o atual percorre com um quadrado ver
      if(bloco.eAtual){
        fill("green")
        noStroke();
        square(i*res, j*res, res);

        //Exceto a entrada e a saida
        if(i == 1 && j == 1){
          fill("red");
          noStroke();
          square(i*res, j*res, res);
        }
      }
  }
}

