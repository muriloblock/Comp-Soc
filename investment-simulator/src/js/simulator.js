// Lógica do Simulador de Investimentos
// Contém cálculos para diferentes cenários de investimento

// Taxas de rentabilidade mensais para diferentes tipos de investimento
// Estas taxas serão atualizadas dinamicamente pela API do Banco Central
let taxasInvestimento = {
    'poupanca': 0.005,      // 0.5% a.m. (6% a.a.)
    'cdb': 0.010,           // 1.0% a.m. (12.68% a.a.)
    'lci': 0.008,           // 0.8% a.m. (10.03% a.a.)
    'tesouro-selic': 0.009, // 0.9% a.m. (11.35% a.a.)
    'tesouro-ipca': 0.012,  // 1.2% a.m. (15.39% a.a.)
    'acoes': 0.015,         // 1.5% a.m. (19.56% a.a.)
    'fiis': 0.013           // 1.3% a.m. (16.77% a.a.)
};

// Informações sobre a última atualização das taxas
let infoTaxas = {
    dataAtualizacao: null,
    valoresAnuais: null
};

/**
 * Atualiza as taxas de investimento com dados reais da API do BCB
 */
async function atualizarTaxasReais() {
    try {
        const taxasReais = await buscarTodasTaxas();
        
        // Atualizar taxas mensais
        taxasInvestimento['poupanca'] = taxasReais.poupanca;
        taxasInvestimento['cdb'] = taxasReais.cdb;
        taxasInvestimento['lci'] = taxasReais.lci;
        taxasInvestimento['tesouro-selic'] = taxasReais.tesouroSelic;
        taxasInvestimento['tesouro-ipca'] = taxasReais.tesouroIpca;
        taxasInvestimento['acoes'] = taxasReais.acoes;
        taxasInvestimento['fiis'] = taxasReais.fiis;
        
        // Armazenar informações de atualização
        infoTaxas.dataAtualizacao = taxasReais.dataAtualizacao;
        infoTaxas.valoresAnuais = taxasReais.valores_anuais;
        
        console.log('Taxas atualizadas:', taxasInvestimento);
        
        // Atualizar labels no select
        atualizarLabelsSelect();
        
        // Exibir notificação de sucesso
        mostrarNotificacao('✅ Taxas atualizadas com dados do Banco Central!', 'sucesso');
        
        return true;
    } catch (erro) {
        console.error('Erro ao atualizar taxas:', erro);
        mostrarNotificacao('⚠️ Usando taxas estimadas (erro ao conectar com API)', 'aviso');
        return false;
    }
}

/**
 * Atualiza os labels do select com as taxas atuais
 */
function atualizarLabelsSelect() {
    const select = document.getElementById('tipo-investimento');
    if (!select) return;
    
    const opcoes = {
        'poupanca': `Poupança (${formatarTaxa(taxasInvestimento['poupanca'])} a.m.)`,
        'cdb': `CDB (${formatarTaxa(taxasInvestimento['cdb'])} a.m.)`,
        'lci': `LCI/LCA (${formatarTaxa(taxasInvestimento['lci'])} a.m.)`,
        'tesouro-selic': `Tesouro Selic (${formatarTaxa(taxasInvestimento['tesouro-selic'])} a.m.)`,
        'tesouro-ipca': `Tesouro IPCA+ (${formatarTaxa(taxasInvestimento['tesouro-ipca'])} a.m.)`,
        'acoes': `Ações (${formatarTaxa(taxasInvestimento['acoes'])} a.m.)`,
        'fiis': `FIIs (${formatarTaxa(taxasInvestimento['fiis'])} a.m.)`
    };
    
    Array.from(select.options).forEach(option => {
        if (opcoes[option.value]) {
            option.textContent = opcoes[option.value];
        }
    });
}

/**
 * Mostra notificação para o usuário
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'sucesso' ? '#4CAF50' : tipo === 'aviso' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

function simularInvestimento(tipo, valorInicial, aporteMensal, periodoAnos) {
    const taxaMensal = taxasInvestimento[tipo];
    const meses = periodoAnos * 12;
    let valorAtual = valorInicial;
    let totalInvestido = valorInicial;
    
    const evolucaoMensal = [];
    
    // Adicionar valor inicial no primeiro mês
    evolucaoMensal.push({
        mes: 0,
        valorInvestido: valorInicial,
        valorTotal: valorInicial,
        rendimento: 0
    });
    
    // Calcular evolução mês a mês
    for (let mes = 1; mes <= meses; mes++) {
        // Aplicar rendimento no valor atual
        valorAtual = valorAtual * (1 + taxaMensal);
        
        // Adicionar aporte mensal
        valorAtual += aporteMensal;
        totalInvestido += aporteMensal;
        
        const rendimento = valorAtual - totalInvestido;
        
        evolucaoMensal.push({
            mes: mes,
            valorInvestido: totalInvestido,
            valorTotal: valorAtual,
            rendimento: rendimento
        });
    }
    
    return {
        tipo: tipo,
        valorInicial: valorInicial,
        aporteMensal: aporteMensal,
        periodo: periodoAnos,
        valorInvestido: totalInvestido,
        valorFinal: valorAtual,
        rendimento: valorAtual - totalInvestido,
        evolucao: evolucaoMensal
    };
}

function calcularJurosCompostos(principal, taxa, tempo) {
    return principal * Math.pow((1 + taxa), tempo);
}

function calcularRendaFixa(valorInicial, taxaAnual, anos) {
    const taxaMensal = taxaAnual / 12;
    const meses = anos * 12;
    return valorInicial * Math.pow((1 + taxaMensal), meses);
}

function calcularAporteRegular(valorInicial, aporteMensal, taxaMensal, meses) {
    let valorTotal = valorInicial;
    
    for (let i = 0; i < meses; i++) {
        valorTotal = valorTotal * (1 + taxaMensal) + aporteMensal;
    }
    
    return valorTotal;
}

// Função para calcular diferentes cenários de risco
function calcularCenarios(valorInicial, aporteMensal, anos) {
    const cenarios = {};
    
    Object.keys(taxasInvestimento).forEach(tipo => {
        cenarios[tipo] = simularInvestimento(tipo, valorInicial, aporteMensal, anos);
    });
    
    return cenarios;
}

// Função para calcular inflação
function aplicarInflacao(valor, taxaInflacao, anos) {
    return valor / Math.pow((1 + taxaInflacao), anos);
}

// Função auxiliar para formatar valores monetários
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}