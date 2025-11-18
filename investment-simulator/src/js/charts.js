// Gerenciamento de gráficos para o Simulador de Investimentos
// Utiliza Chart.js para visualização de dados

let graficoEvolucao = null;

function initializeChart() {
    const ctx = document.getElementById('grafico-evolucao');
    if (!ctx) return;
    
    graficoEvolucao = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Valor Investido',
                    data: [],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Valor Total',
                    data: [],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Rendimento',
                    data: [],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução do Investimento ao Longo do Tempo',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Tempo (meses)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function atualizarGrafico(resultados) {
    if (!graficoEvolucao) {
        initializeChart();
    }
    
    const labels = [];
    const valorInvestido = [];
    const valorTotal = [];
    const rendimento = [];
    
    // Preparar dados para o gráfico
    resultados.evolucao.forEach((ponto, index) => {
        // Mostrar apenas alguns pontos para não poluir o gráfico
        if (index % Math.max(1, Math.floor(resultados.evolucao.length / 20)) === 0 || 
            index === resultados.evolucao.length - 1) {
            labels.push(`Mês ${ponto.mes}`);
            valorInvestido.push(ponto.valorInvestido);
            valorTotal.push(ponto.valorTotal);
            rendimento.push(ponto.rendimento);
        }
    });
    
    // Atualizar dados do gráfico
    graficoEvolucao.data.labels = labels;
    graficoEvolucao.data.datasets[0].data = valorInvestido;
    graficoEvolucao.data.datasets[1].data = valorTotal;
    graficoEvolucao.data.datasets[2].data = rendimento;
    
    graficoEvolucao.update('active');
}

function criarGraficoComparativo(cenarios) {
    const ctx = document.getElementById('grafico-comparativo');
    if (!ctx) return;
    
    const tipos = Object.keys(cenarios);
    const valores = tipos.map(tipo => cenarios[tipo].valorFinal);
    const cores = [
        '#007bff', '#28a745', '#ffc107', '#dc3545', 
        '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'
    ];
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: tipos.map(tipo => tipo.toUpperCase()),
            datasets: [{
                label: 'Valor Final (R$)',
                data: valores,
                backgroundColor: cores.slice(0, tipos.length),
                borderColor: cores.slice(0, tipos.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação entre Tipos de Investimento'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Valor Final: ' + new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}