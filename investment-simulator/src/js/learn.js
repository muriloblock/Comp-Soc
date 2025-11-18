document.addEventListener('DOMContentLoaded', () => {
    setupCalculators();
    setupQuiz();
});

function setupCalculators() {
    window.calcularJuros = function calcularJuros() {
        const principal = parseFloat(document.getElementById('calc-principal')?.value || '');
        const rate = parseFloat(document.getElementById('calc-rate')?.value || '') / 100;
        const time = parseInt(document.getElementById('calc-time')?.value || '', 10);

        if (isFinite(principal) && principal > 0 && isFinite(rate) && rate > 0 && Number.isInteger(time) && time > 0) {
            const futureValue = principal * Math.pow(1 + rate, time);
            const earnings = futureValue - principal;

            const resultContainer = document.getElementById('juros-result');
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <p><strong>Valor Final:</strong> ${formatarMoeda(futureValue)}</p>
                    <p><strong>Rendimento:</strong> ${formatarMoeda(earnings)}</p>
                `;
            }
        }
    };

    window.calcularMeta = function calcularMeta() {
        const meta = parseFloat(document.getElementById('meta-valor')?.value || '');
        const anos = parseInt(document.getElementById('meta-anos')?.value || '', 10);
        const taxa = parseFloat(document.getElementById('meta-taxa')?.value || '') / 100;

        if (isFinite(meta) && meta > 0 && Number.isInteger(anos) && anos > 0 && isFinite(taxa) && taxa > 0) {
            const aporteMensal = (meta * taxa) / (12 * (Math.pow(1 + taxa, anos) - 1));

            const resultContainer = document.getElementById('meta-result');
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <p><strong>Aporte Mensal Necessário:</strong> ${formatarMoeda(aporteMensal)}</p>
                `;
            }
        }
    };
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/* ====================== Quiz Gamificado ====================== */
const quizPerguntas = [
    {
        texto: 'LCI e LCA são investimentos isentos de Imposto de Renda para pessoas físicas.',
        resposta: true,
        explicacao: 'Esses títulos são emitidos por bancos e concedem isenção de IR para incentivar o crédito imobiliário e agrícola.'
    },
    {
        texto: 'A reserva de emergência deve ser investida predominantemente em ações para render mais.',
        resposta: false,
        explicacao: 'A reserva deve priorizar segurança e liquidez, normalmente em produtos de renda fixa pós-fixados e com resgate rápido.'
    },
    {
        texto: 'Diversificar investimentos reduz o risco total da carteira.',
        resposta: true,
        explicacao: 'Ao distribuir recursos entre diferentes ativos e setores, você diminui o impacto negativo de um único investimento.'
    },
    {
        texto: 'Investimentos em Tesouro Selic são indicados para objetivos de curto prazo.',
        resposta: true,
        explicacao: 'O Tesouro Selic acompanha a taxa básica de juros e possui liquidez diária, ideal para objetivos próximos e reserva de emergência.'
    },
    {
        texto: 'FIIs (Fundos Imobiliários) garantem retorno fixo mensal, independente de mercado.',
        resposta: false,
        explicacao: 'Os proventos dos FIIs variam conforme os resultados do fundo e podem oscilar de acordo com o mercado imobiliário.'
    },
    {
        texto: 'O FGC protege investimentos em CDB até o limite de R$ 250 mil por CPF e por instituição.',
        resposta: true,
        explicacao: 'O Fundo Garantidor de Créditos cobre alguns produtos bancários em caso de falência da instituição emissora, até os limites estabelecidos.'
    },
    {
        texto: 'A inflação representa o aumento generalizado de preços e reduz o poder de compra do dinheiro ao longo do tempo.',
        resposta: true,
        explicacao: 'Por isso é importante buscar investimentos que, ao menos, superem a inflação para manter seu poder aquisitivo.'
    },
    {
        texto: 'Investir todo o capital em um único ativo é uma estratégia recomendada para iniciantes.',
        resposta: false,
        explicacao: 'Concentrar todos os recursos eleva o risco. É melhor dividir entre produtos diferentes compatíveis com seu perfil.'
    },
    {
        texto: 'O aporte mensal em investimentos potencializa os efeitos dos juros compostos.',
        resposta: true,
        explicacao: 'A constância de aportes somada aos juros compostos acelera o crescimento do patrimônio no longo prazo.'
    },
    {
        texto: 'Investir é apenas para quem tem muito dinheiro disponível.',
        resposta: false,
        explicacao: 'Hoje existem produtos acessíveis com valores iniciais baixos, permitindo começar mesmo com pouco dinheiro.'
    }
];

let quizDeck = [];
let quizIndiceAtual = 0;
let quizPontuacao = 0;

const quizSelectors = {
    stack: () => document.getElementById('quiz-card-stack'),
    progress: () => document.getElementById('quiz-progress'),
    score: () => document.getElementById('quiz-score'),
    feedback: () => document.getElementById('quiz-feedback'),
    restart: () => document.getElementById('quiz-restart'),
    template: () => document.getElementById('quiz-card-template')
};

function setupQuiz() {
    const stack = quizSelectors.stack();
    if (!stack) return;

    const restartBtn = quizSelectors.restart();
    restartBtn?.addEventListener('click', reiniciarQuiz);

    iniciarQuiz();
}

function iniciarQuiz() {
    quizDeck = embaralhar([...quizPerguntas]);
    quizIndiceAtual = 0;
    quizPontuacao = 0;

    const stack = quizSelectors.stack();
    const feedback = quizSelectors.feedback();

    if (!stack || !feedback) return;

    stack.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    const restartBtn = quizSelectors.restart();
    if (restartBtn) restartBtn.hidden = true;

    for (let i = 0; i < quizDeck.length; i++) {
        const card = criarCarta(quizDeck[i], i);
        stack.appendChild(card);
    }

    atualizarStatus();
}

function reiniciarQuiz() {
    iniciarQuiz();
}

function criarCarta(questao, indice) {
    const template = quizSelectors.template();
    if (!template) throw new Error('Template da carta não encontrado.');

    const card = template.content.firstElementChild.cloneNode(true);
    const textoEl = card.querySelector('.quiz-card-text');
    const hintEl = card.querySelector('.quiz-card-hint');

    if (textoEl) textoEl.textContent = questao.texto;
    if (hintEl) hintEl.textContent = questao.explicacao;

    card.dataset.index = String(indice);
    card.style.zIndex = String(100 + indice);

    anexarGestos(card);

    return card;
}

function anexarGestos(card) {
    let inicioX = 0;
    let deslocamentoX = 0;
    let ativo = false;

    card.addEventListener('pointerdown', (evento) => {
        if (!isCartaAtual(card)) return;
        inicioX = evento.clientX;
        deslocamentoX = 0;
        ativo = true;
        card.classList.add('dragging');
        card.setPointerCapture(evento.pointerId);
    });

    card.addEventListener('pointermove', (evento) => {
        if (!ativo) return;
        deslocamentoX = evento.clientX - inicioX;
        const rotacao = deslocamentoX / 12;
        card.style.transform = `translate(${deslocamentoX}px, 0) rotate(${rotacao}deg)`;
        
        // Adicionar classes para feedback visual
        if (deslocamentoX > 30) {
            card.classList.add('swipe-right');
            card.classList.remove('swipe-left');
        } else if (deslocamentoX < -30) {
            card.classList.add('swipe-left');
            card.classList.remove('swipe-right');
        } else {
            card.classList.remove('swipe-right', 'swipe-left');
        }
    });

    const finalizarGesto = (evento) => {
        if (!ativo) return;
        card.classList.remove('dragging', 'swipe-right', 'swipe-left');
        card.releasePointerCapture?.(evento.pointerId);

        const threshold = 120;
        if (Math.abs(deslocamentoX) > threshold) {
            const respondeuVerdadeiro = deslocamentoX > 0;
            processarResposta(card, respondeuVerdadeiro);
        } else {
            card.style.transform = '';
        }
        ativo = false;
    };

    card.addEventListener('pointerup', finalizarGesto);
    card.addEventListener('pointercancel', finalizarGesto);
    card.addEventListener('lostpointercapture', () => {
        if (!ativo) return;
        card.classList.remove('dragging', 'swipe-right', 'swipe-left');
        card.style.transform = '';
        ativo = false;
    });
}

function processarResposta(card, respostaUsuario) {
    if (!isCartaAtual(card) || card.dataset.resolvido === 'true') {
        card.style.transform = '';
        return;
    }

    const questao = quizDeck[quizIndiceAtual];
    const acertou = questao && respostaUsuario === questao.resposta;
    if (acertou) quizPontuacao += 1;

    card.dataset.resolvido = 'true';
    card.classList.add('revealed');
    card.classList.toggle('correct', !!acertou);
    card.classList.toggle('incorrect', !acertou);

    apresentarFeedback(acertou, questao?.explicacao || '');

    const direcao = respostaUsuario ? 1 : -1;
    requestAnimationFrame(() => {
        card.style.transform = `translate(${direcao * window.innerWidth}px, -60px) rotate(${direcao * 24}deg)`;
        card.style.opacity = '0';
    });

    setTimeout(() => {
        card.remove();
        quizIndiceAtual += 1;
        atualizarStatus();
        if (quizIndiceAtual >= quizDeck.length) {
            finalizarQuiz();
        }
    }, 320);
}

function apresentarFeedback(acertou, explicacao) {
    const feedback = quizSelectors.feedback();
    if (!feedback) return;

    feedback.classList.remove('success', 'error');
    feedback.classList.add(acertou ? 'success' : 'error');

    const prefixo = acertou ? 'Perfeito! ' : 'Quase! ';
    feedback.textContent = `${prefixo}${explicacao}`;
}

function atualizarStatus() {
    const progresso = quizSelectors.progress();
    const pontuacao = quizSelectors.score();

    if (progresso) {
        if (quizIndiceAtual >= quizDeck.length) {
            progresso.textContent = 'Aprendizado concluído!';
        } else {
            progresso.textContent = `Pergunta ${quizIndiceAtual + 1} de ${quizDeck.length}`;
        }
    }

    if (pontuacao) {
        const sufixo = quizPontuacao === 1 ? '' : 's';
        pontuacao.textContent = `${quizPontuacao} acerto${sufixo}`;
    }
}

function finalizarQuiz() {
    const feedback = quizSelectors.feedback();
    const restartBtn = quizSelectors.restart();

    if (feedback) {
        const total = quizDeck.length || 1;
        const aproveitamento = Math.round((quizPontuacao / total) * 100);
        feedback.classList.remove('error');
        feedback.classList.add('success');
        feedback.textContent = `Você concluiu o desafio com ${quizPontuacao} de ${total} acertos (${aproveitamento}%).`;
    }

    if (restartBtn) {
        restartBtn.hidden = false;
        try {
            restartBtn.focus({ preventScroll: true });
        } catch (error) {
            restartBtn.focus();
        }
    }
}

function obterCartaAtual() {
    const stack = quizSelectors.stack();
    if (!stack) return null;
    const cartas = stack.querySelectorAll('.quiz-card');
    if (cartas.length === 0) return null;
    return cartas[cartas.length - 1];
}

function isCartaAtual(card) {
    const cartaAtual = obterCartaAtual();
    return cartaAtual === card;
}

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}