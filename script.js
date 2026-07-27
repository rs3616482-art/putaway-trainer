const inputField = document.getElementById('barcode-input');
const imagemEtapa = document.getElementById('imagem-etapa');

// Controle das etapas (1: Caixa, 2: Rua, 3: Produto, 4: Endereço/Finalização)
let etapaAtual = 1;
let contadorErroEndereco = 0;

// Foco automático e constante para o coletor Honeywell funcionar direto
inputField.addEventListener('blur', () => {
    setTimeout(() => inputField.focus(), 100);
});
inputField.focus();

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const valorLido = inputField.value.trim().toUpperCase();
        inputField.value = ""; // Limpa a barra para o próximo bip
        processarFluxo(valorLido);
    }
});

function processarFluxo(codigo) {
    // 1. Simular erro de pular etapa (se digitar "ERRO" ou aleatoriamente)
    if (codigo === "ERRO" || Math.random() < 0.15) {
        imagemEtapa.src = "erro2.jpg"; // Tela vermelha de erro
        setTimeout(() => resetarParaInicio(), 3500); // Volta pro início
        return;
    }

    // Fluxo normal do processo
    if (etapaAtual === 1) {
        // Leu a caixa, pede endereço perto
        imagemEtapa.src = "passo4.jpg";
        etapaAtual = 2;
    } else if (etapaAtual === 2) {
        // Leu o endereço perto, pede produto
        imagemEtapa.src = "passo5.jpg";
        etapaAtual = 3;
    } else if (etapaAtual === 3) {
        // Chance de cair na tela vermelha de endereço cheio (3 a 4 vezes)
        if (contadorErroEndereco < 3 && Math.random() > 0.4) {
            contadorErroEndereco++;
            imagemEtapa.src = "erro1.jpg"; // Tela de "endereço atingiu limite"
            return; // Trava aqui até bipar o endereço certo
        }

        // Deu tudo certo, pede a finalização
        imagemEtapa.src = "passo5.jpg";
        etapaAtual = 4;
    } else if (etapaAtual === 4) {
        // Bipou os dois bips pra finalizar a caixa!
        imagemEtapa.src = "sucesso.jpg"; // Tela verde
        setTimeout(() => {
            resetarParaInicio();
        }, 3000); // Fica verde por 3 segundos
    }
}

function resetarParaInicio() {
    etapaAtual = 1;
    contadorErroEndereco = 0;
    imagemEtapa.src = "passo5.jpg"; // Começa na tela de escanear caixa
}
