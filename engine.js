let canvas, contexto, ALTURA, LARGURA, frames = 0, img, record
let maxPulos = 3;
let velocidade = 6;
let estadoAtual;
let estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
}
let chao = {
    y: 550,
    altura: 50,
    cor: '#ffdf70',

    atualiza: function() {
        this.x -= velocidade
        if(this.x <= -30) {
            this.x = 0
        }
    },

    desenha: function () {
        //spriteChao.desenha(this.x, this.y)   usar esse quando tiver o sprite do chao;
        contexto.fillStyle = this.cor;
        contexto.fillRect(0, this.y, LARGURA, ALTURA)
    }
}

let bloco = {
    x: 50,
    y: 0,
    altura: spriteBoneco.altura,
    largura: spriteBoneco.largura,
    cor: "#ff4e4e",
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 23.6,
    qntPulos: 0,
    score: 0,
    rotacao: 0,

    atualiza: function() {
        this.velocidade += this.gravidade
        this.y += this.velocidade
        this.rotacao += Math.PI / 180 * velocidade

        if (this.y > chao.y - this.altura && estadoAtual !== estados.perdeu) {
            this.y = chao.y - this.altura
            this.qntPulos = 0
            this.velocidade = 0
        }
    },

    pula: function() {
        if(this.qntPulos < maxPulos) {
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++;
        }
    },

    reset: function() {
        this.velocidade = 0
        this.y = 0

        if (this.score > record) {
            localStorage.setItem('record', this.score)
            record = this.score
        }

        this.score = 0
    },

    desenha: function () {
        // contexto.fillStyle = this.cor;
        // contexto.fillRect(this.x, this.y, this.largura, this.altura)

        //Criando rotação
        contexto.save()
        //operaçoes para rotacionar
        contexto.translate(this.x + this.largura / 2, this.y + this.altura / 2)
        contexto.rotate(this.rotacao)
        spriteBoneco.desenha(-this.largura / 2, -this.altura / 2)

        contexto.restore()

       /* //transferindo para o boneco
        spriteBoneco.desenha(this.x, this.y)*/

    }
}

let obstaculos = {
    _obs: [],
    cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempoInsere: 0,

    insereElemento: function () {
        this._obs.push({
            x: LARGURA,
            //largura aleatória
            //largura: 30 + Math.floor(21 * Math.random()),

            //largura fixa
            largura: 50,
            altura: 30 + Math.floor(120 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())]
        });

        this.tempoInsere = 40 + Math.floor(20 * Math.random())
    },

    atualiza: function () {

        if (this.tempoInsere === 0) {
            this.insereElemento()
        } else {
            this.tempoInsere--
        }

        for(let i = 0, tam = this._obs.length; i < tam; i++) {
            let obs = this._obs[i];

            //decrementa o x do objeto criado, fazendo com que ele se desloque
            obs.x -= velocidade
            if(
                bloco.x < obs.x + obs.largura &&
                bloco.x + bloco.largura >= obs.x &&
                bloco.y + bloco.altura >= chao.y - obs.altura
            ) estadoAtual = estados.perdeu

            else if(obs.x === 0) bloco.score++

            //destruir o objeto assim que sai do canvas
            else if (obs.x <= -obs.largura) {
                this._obs.splice(i, 1)
                tam--
                i--
            }
        }
    },

    //Limpar o array para começar de novo.
    limpa: function(){
        this._obs = []
    },

    desenha: function () {
      for (let i = 0, tam = this._obs.length; i < tam; i++) {
          let obs = this._obs[i];
          contexto.fillStyle = obs.cor
          contexto.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura)
        }

    }
}

function main() {
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    if (LARGURA >= 600) {
        LARGURA = 600
        ALTURA = 600
    }

    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000"

    contexto = canvas.getContext('2d')

    //adicionando o canvas no html
    document.body.appendChild(canvas)

    //verificar se a pessoa clicou
    document.addEventListener("mousedown", clique)

    //definindo o status do jogo
    estadoAtual = estados.jogar
    record = localStorage.getItem('record')

    if (record === null) record = 0

    img = new Image()
    img.src = "sheet.png";

    roda();
}

function clique(evento) {
    if( estadoAtual === estados.jogando) {
        bloco.pula()
    }

    else if (estadoAtual === estados.jogar) {
        estadoAtual = estados.jogando
    }

    else if (estadoAtual === estados.perdeu && bloco.y >= 2 * ALTURA) {
        estadoAtual = estados.jogar
        obstaculos.limpa()
        bloco.reset()
    }
}

function roda(){
    atualiza();
    desenha();

    //colocando em loop infinito
    window.requestAnimationFrame(roda)
}

function atualiza() {
    frames++;
    bloco.atualiza();

    if( estadoAtual === estados.jogando) {
        obstaculos.atualiza()
    }
}

function desenha(){
    //define a cor de fundo
    //contexto.fillStyle = "#50beff";

    // criando o fundo com imagem
    //define a area a ser preenchida
    //contexto.fillRect(0, 0, LARGURA, ALTURA)

    //desenha imagem
    bg.desenha(0, 0)
    //spriteBoneco.desenha(50, 50)

    contexto.fillStyle = "#fff";
    contexto.font = "50px Arial";
    contexto.fillText(bloco.score, 30, 68)
// JOGAR
    if(estadoAtual === estados.jogar) {
        contexto.fillStyle = 'green';
        contexto.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)
    }

    // PERDEU
    else if ( estadoAtual === estados.perdeu) {
        contexto.fillStyle = 'red';
        contexto.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)

        contexto.save();
        contexto.translate(LARGURA/ 2, ALTURA / 2)
        contexto.fillStyle = '#fff'

        if(bloco.score > record)
            contexto.fillText('Novo Record!', -150, -65);

        else if (record < 10)
            contexto.fillText('Recorde ' + record, -99, -65);

        else if (record >= 10 && record < 100)
            contexto.fillText('Recorde ' + record, -112, -65);

        else
            contexto.fillText('Recorde ' + record, -125, -65);

        if (bloco.score < 10) contexto.fillText(bloco.score, -13, 19)
        else if (bloco.score >= 10 && bloco.score < 100) contexto.fillText(bloco.score, -26, 19)
        else contexto.fillText(bloco.score, -39, 19)

        // Pra não desenhar apartir do ponto anterior, damos um restore
        contexto.restore()

    }
    // JOGANDO
    else if ( estadoAtual === estados.jogando) {
        obstaculos.desenha()
    }

    chao.desenha()
    bloco.desenha()
}

main();
