// Lógica do Simulador de Investimentos
// Contém cálculos para diferentes cenários de investimento

// Taxas de rentabilidade mensais para diferentes tipos de investimento
const taxasInvestimento = {
    'poupanca': 0.005,      // 0.5% a.m. (6% a.a.)
    'cdb': 0.010,           // 1.0% a.m. (12.68% a.a.)
    'lci': 0.008,           // 0.8% a.m. (10.03% a.a.)
    'tesouro-selic': 0.009, // 0.9% a.m. (11.35% a.a.)
    'tesouro-ipca': 0.012,  // 1.2% a.m. (15.39% a.a.)
    'acoes': 0.015,         // 1.5% a.m. (19.56% a.a.)
    'fiis': 0.013           // 1.3% a.m. (16.77% a.a.)
};

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