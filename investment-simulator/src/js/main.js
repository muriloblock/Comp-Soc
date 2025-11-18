// Simulador de Investimentos - Arquivo principal JavaScript
// Inicializa a aplicação e gerencia funcionalidades gerais

document.addEventListener('DOMContentLoaded', () => {
    console.log('Simulador de Investimentos Inicializado');
    
    // Configurar ouvintes de eventos
    setupEventListeners();
    
    // Inicializar gráfico vazio
    initializeChart();
});

function setupEventListeners() {
    const simularButton = document.getElementById('simular');
    if (simularButton) {
        simularButton.addEventListener('click', handleSimulation);
    }
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function handleSimulation() {
    const tipoInvestimento = document.getElementById('tipo-investimento').value;
    const valorInicial = parseFloat(document.getElementById('valor-inicial').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporte-mensal').value) || 0;
    const periodo = parseInt(document.getElementById('periodo').value) || 1;
    
    if (valorInicial <= 0 && aporteMensal <= 0) {
        alert('Por favor, insira um valor inicial ou aporte mensal válido.');
        return;
    }
    
    if (periodo <= 0) {
        alert('Por favor, insira um período válido.');
        return;
    }
    
    // Executar simulação
    const resultados = simularInvestimento(tipoInvestimento, valorInicial, aporteMensal, periodo);
    exibirResultados(resultados);
    atualizarGrafico(resultados);
}

function exibirResultados(resultados) {
    const totalInvestido = resultados.valorInvestido;
    const valorFinal = resultados.valorFinal;
    const rendimento = valorFinal - totalInvestido;
    const rentabilidade = ((valorFinal / totalInvestido - 1) * 100);
    
    document.getElementById('total-investido').textContent = formatarMoeda(totalInvestido);
    document.getElementById('valor-final').textContent = formatarMoeda(valorFinal);
    document.getElementById('rendimento').textContent = formatarMoeda(rendimento);
    document.getElementById('rentabilidade').textContent = rentabilidade.toFixed(2) + '%';
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}