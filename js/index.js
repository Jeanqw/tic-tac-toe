const campos = document.querySelectorAll(".col div");
const img = document.querySelectorAll(".col div img");
const inputs = document.querySelectorAll(".player");
const mainTabuleiro = document.querySelector(".main-tabuleiro");

const modal = document.querySelector("dialog");
const btnClose = document.querySelector("dialog button");
const jogo = document.querySelector(".jogo");
const ganhador = document.querySelector("dialog h2 span");

var matrizTabuleiro = [ //definindo uma matriz global que servirá como 'clone' do tabuleiro (irá facilitar na validação do resultado)
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

var lastTime = "O"; //variavel global para armazenar quem fez a última jogada
var secondTabuleiro = ""; //variavel para armazenar um clone do tabuleiro para mostrar na modal quando o jogo acabar
var houveGanhador = false; //flag que indica que houve vencedor

//verificação para a escolha de quem vai começar aconteça só quando ninguém houver jogado ainda 
inputs.forEach((el)=>{
    el.addEventListener("click", ()=>{

        var vazio = ""; 
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                vazio += matrizTabuleiro[i][j];
            }
        }
     
        if (inputs[0].checked && vazio == '') {
            lastTime = "O";
        } else  if (inputs[1].checked && vazio == '') {
            lastTime = "X";
        }
    })
})

//fazendo a jogada a cada clique no tabuleiro
campos.forEach((el, i) => {
    el.addEventListener("click", () => {
        if (lastTime == "O" && img[i].getAttribute("src") == "") {
            jogada("X", el, i);
        } else if (lastTime == "X" && img[i].getAttribute("src") == "") {
            jogada("O", el, i);
        }
    })
})

//função que irá fazer a jogada
function jogada(play, el, i) {
    img[i].setAttribute("src", `img/${play}.svg`);
    lastTime = play;

    let posicao = el.className.split("-"); //pegando a posicao de onde foi clicado e separando em linha e coluna
    let linha = posicao[0];
    let coluna = posicao[1];
    matrizTabuleiro[linha][coluna] = play; //marcando na 'matriz clone' do tabuleiro 
    checkWinner();
}

//função que checa vencedor
function checkWinner() {
    // Verificar linhas
    for (let i = 0; i < 3; i++) {
        if (matrizTabuleiro[i][0] !== '' && matrizTabuleiro[i][0] === matrizTabuleiro[i][1] && matrizTabuleiro[i][1] === matrizTabuleiro[i][2]) {
            abrirModal(matrizTabuleiro[i][0]);
            limparMatriz();
        }
    }

    // Verificar colunas
    for (let j = 0; j < 3; j++) {
        if (matrizTabuleiro[0][j] !== '' && matrizTabuleiro[0][j] === matrizTabuleiro[1][j] && matrizTabuleiro[1][j] === matrizTabuleiro[2][j]) {
            abrirModal(matrizTabuleiro[0][j]);
            limparMatriz();
        }
    }

    // Verificar diagonal principal
    if (matrizTabuleiro[0][0] !== '' && matrizTabuleiro[0][0] === matrizTabuleiro[1][1] && matrizTabuleiro[1][1] === matrizTabuleiro[2][2]) {
        abrirModal(matrizTabuleiro[0][0]);
        limparMatriz();
    }

    // Verificar diagonal secundária
    if (matrizTabuleiro[0][2] !== '' && matrizTabuleiro[0][2] === matrizTabuleiro[1][1] && matrizTabuleiro[1][1] === matrizTabuleiro[2][0]) {
        abrirModal(matrizTabuleiro[0][2]);
        limparMatriz();
    }

    //Verificar se deu empate
    if(checarCasasPreenchidas() && houveGanhador == false){
        abrirModal("Não houve vencedor");
        limparMatriz();
    }
}

//função para limpar a matriz e restaurar os valores para o padrão
function limparMatriz() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            matrizTabuleiro[i][j] = "";
        }
    }

    img.forEach((el) => {
        el.setAttribute("src", "");
    })
    lastTime = "O";
    inputs[0].checked = true;
    houveGanhador = false;
}

//funcao que abrirá um modal com um clone do tabuleiro quando houver vencedor
function abrirModal(winner){
    houveGanhador = true;
    modal.showModal();

    secondTabuleiro = mainTabuleiro.cloneNode(true);
    jogo.appendChild(secondTabuleiro);
    secondTabuleiro.style.width = "60%";

    ganhador.innerHTML = winner;
}

//funcao que verifica se todas as casas estão preenchidas
function checarCasasPreenchidas(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(matrizTabuleiro[i][j] === ''){
                return false;
            }
        }
    }

    return true;
}

//evento para fechar o modal e remover o clone do tabuleiro da variavel
btnClose.addEventListener('click', ()=>{
    secondTabuleiro.remove();
    modal.close();  
})