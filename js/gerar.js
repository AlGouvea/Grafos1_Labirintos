let labirinto = null;
let res = 200;
flag = 0;

function loadScript(url){    
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  head.appendChild(script);
}

var btn = document.getElementById("Resolver");

function setup(){
    var canvas = createCanvas(800, 800);
    canvas.style.marginLeft = "800px";
    noStroke();
    
    geraLabirinto(width/res + 2, height/res + 2);
    
    if(flag == 0){
      drawlabirinto();
    }
}

function setupGraph(){
  alert("foi");
}

function exit(){
  flag = 1;
  btn.style.visibility = "visible";
  btn.addEventListener('click', function resolver(){
    if(flag == 1){
      setupGraph();
      flag = 2;
    }
  });
}

if(flag == 0){
  let count = 0;

  function draw(){
    if(count % 3 == 0)
    {
      if(labirinto.stack.length != 0)
      {
        background("grey");
        labirintoIterar();
        drawlabirinto();
      }else{
        if(flag == 0){
          alert("Labirinto Pronto!S2");
        }
        exit();
      }
    }
    count++;
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
    
      let blocoAndparede = pickVizinho(atual);
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
      let nao_visto = [];
    
      let cimabloco = labirinto.blocos[bloco.x][bloco.y+1];
      if(!cimabloco.visto)
      {
        nao_visto.push({
          "bloco":cimabloco,
          "parede":"cima"
        });
      }
      let baixobloco = labirinto.blocos[bloco.x][bloco.y-1];
      if(!baixobloco.visto)
      {
        nao_visto.push({
          "bloco":baixobloco,
          "parede":"baixo"
        });
      }
      let direitabloco = labirinto.blocos[bloco.x+1][bloco.y];
      if(!direitabloco.visto)
      {
        nao_visto.push({
          "bloco":direitabloco,
          "parede":"direita"
        });
      }
      let esquerdabloco = labirinto.blocos[bloco.x-1][bloco.y];
      if(!esquerdabloco.visto)
      {
        nao_visto.push({
          "bloco":esquerdabloco,
          "parede":"esquerda"
        });
      }
      
      if(nao_visto.length == 0)
      {
        return null;
      }
      
      return nao_visto[Math.floor(
        Math.random()*nao_visto.length
      )];
  }

  function paredeOposta(parede){
      if(parede == "cima")
      {
        return "baixo"
      }
      else if(parede == "baixo")
      {
        return "cima"
      }
      else if(parede == "direita")
      {
        return "esquerda"
      }
      else if(parede == "esquerda")
      {
        return "direita"
      }
      
      return -1;
  }

  function drawlabirinto(){
      push();
      translate(-res, -res);
      for(let i = 0; i < labirinto.blocos.length; i++)
      {
        for(let j = 0; 
            j < labirinto.blocos[i].length; j++)
        {
          let bloco = labirinto.blocos[i][j];
          drawbloco(bloco, i, j);
        }
      }
      pop();
  }

  function drawbloco(bloco, i, j){
      strokeWeight(0);
    
      if(bloco.visto == true)
      {
        fill(255);

        if(i == 1 && j == 1){
          fill("red");
        }
        if(i == 800/res && j == 800/res){
          fill("red");
        }

        square(i*res, j*res, res);
        
        strokeWeight(3);
        stroke("black");
        if(bloco.cima == "parede")
        {
          line((i)*res, (j)*res, 
              (i+1)*res, (j)*res);
        }
        if(bloco.baixo == "parede")
        {
          line((i)*res, (j+1)*res, 
              (i+1)*res, (j+1)*res);
        }
        if(bloco.esquerda == "parede")
        {
          line((i+1)*res, (j)*res, 
              (i+1)*res, (j+1)*res);
        }
        if(bloco.direita == "parede")
        {
          line((i)*res, (j)*res, 
              (i)*res, (j+1)*res);
        }
      }

      if(bloco.eAtual)
      {
        fill("lightgreen")
        noStroke();
        square(i*res, j*res, res);
      }
  }
}else{
  alert("CABOU");
}

