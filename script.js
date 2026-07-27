
const inputField = document.getElementById('barcode-input');
const imagemEtapa = document.getElementById('imagem-etapa');

// Controle das etapas (1: Caixa, 2: Rua, 3: Produto, 4: Endereço/Finalização)
let etapaAtual = 1; 
let contadorErroEndereco = 0;

// Foco automático para o coletor Honeywell funcionar direto
document.addEventListener('click', () => {
    inputField.focus();
});
inputField.focus();

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const valorLido = inputField.value.trim();
        inputField.value = ""; // Limpa a barra para o próximo bip

        processarFluxo(valorLido);
    }
});

function processarFluxo(codigo) {
    // 1. Simular erro de pular etapa (se digitar algo que ele considera erro)
    // Coloquei 15% de chance de dar erro de "pulou etapa"
    if (codigo.toLowerCase() === "erro" || Math.random() < 0.15) {
        imagemEtapa.src = "erro2.jpg.png"; // Tela vermelha de erro de produto/endereço
        setTimeout(() => resetarParaInicio(), 3500); // Volta pro início depois de 3.5 segundos
        return;
    }

    // Fluxo normal do processo
    if (etapaAtual === 1) {
        // Leu a caixa, pede endereço perto
        imagemEtapa.src = "passo4.jpg.png";
        etapaAtual = 2;
    } else if (etapaAtual === 2) {
        // Leu o endereço perto, pede produto
        imagemEtapa.src = "passo5.jpg.png"; 
        etapaAtual = 3;
    } else if (etapaAtual === 3) {
        // Chance de cair na tela vermelha de endereço cheio (3 a 4 vezes)
        if (contadorErroEndereco < 3 && Math.random() > 0.4) {
            contadorErroEndereco++;
            imagemEtapa.src = "erro1.jpg.png"; // Tela de "endereço atingiu limite"
            return; // Ele trava aqui até bipar o endereço certo
        }

        // Deu tudo certo, pede a finalização
        imagemEtapa.src = "passo5.jpg.png"; 
        etapaAtual = 4;
    } else if (etapaAtual === 4) {
        // Bipou os dois bips pra finalizar a caixa!
        imagemEtapa.src = "sucesso.jpg.png"; // Tela verde
        setTimeout(() => {
            etapaAtual = 1; // Reinicia para a próxima caixa
            contadorErroEndereco = 0;
            imagemEtapa.src = "passo5.jpg.png"; // Volta pra tela amarela
        }, 3000); // Fica verde por 3 segundos
    }
}

function resetarParaInicio() {
    etapaAtual = 1;
    imagemEtapa.src = "passo5.jpg.png";
}
