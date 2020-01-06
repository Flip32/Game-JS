function Sprite(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;

    this.desenha = function (xCanvas, yCanvas) {
        contexto.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
    }
}

//Background
var bg = new Sprite(0, 0, 600, 600);
var spriteBoneco = new Sprite(618, 16, 87, 87)
