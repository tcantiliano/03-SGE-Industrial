/* ==========================================================================
   CONFIGURAÇÕES INICIAIS E BANCO DE DADOS LOCAL
   ========================================================================== */
const itensIniciais = [
    { codigo: "MP-001", nome: "Aço Inox 304", categoria: "Matéria-Prima", qtd: 1500, unidade: "KG" },
    { codigo: "MP-002", nome: "Polietileno PEAD", categoria: "Matéria-Prima", qtd: 850, unidade: "KG" },
    { codigo: "INS-045", nome: "Graxa Industrial", categoria: "Insumo", qtd: 12, unidade: "UN" },
    { codigo: "PA-901", nome: "Motor Elétrico 5HP", categoria: "Produto Acabado", qtd: 45, unidade: "UN" },
    { codigo: "EMB-012", nome: "Caixa Papelão 50x50", categoria: "Embalagem", qtd: 0, unidade: "UN" },
    { codigo: "MP-003", nome: "Chapa de Alumínio 2mm", categoria: "Matéria-Prima", qtd: 620, unidade: "M2" },
    { codigo: "INS-088", nome: "Parafuso Sextavado M8", categoria: "Insumo", qtd: 5000, unidade: "UN" },
    { codigo: "PA-902", nome: "Bomba Hidráulica", categoria: "Produto Acabado", qtd: 8, unidade: "UN" },
    { codigo: "EMB-005", nome: "Filme Stretch", categoria: "Embalagem", qtd: 35, unidade: "RL" },
    { codigo: "INS-010", nome: "Eletrodo para Solda AWS", categoria: "Insumo", qtd: 0, unidade: "KG" }
];

let estoqueBanco = JSON.parse(localStorage.getItem('estoque_industrial'));
if (!estoqueBanco) {
    estoqueBanco = itensIniciais;
    localStorage.setItem('estoque_industrial', JSON.stringify(estoqueBanco));
}

let historicoMovimentacoes = JSON.parse(localStorage.getItem('historico_industrial')) || [];
let meuGrafico = null;

// Controle de Sessão de Usuário
let usuarioLogado = { name: "", role: "" };

/* ==========================================================================
   SISTEMA DE LOGIN DE ACESSO
   ========================================================================== */
function autenticar(event) {
    event.preventDefault();

    const usuarioDigitado = document.getElementById('username').value.trim();
    const senhaDigitada = document.getElementById('password').value;
    const erroMsg = document.getElementById('error-message');

    if (usuarioDigitado === 'admin' && senhaDigitada === '12345') {
        usuarioLogado = { name: "Administrador", role: "Admin" };
    } else if (usuarioDigitado === 'usuario01' && senhaDigitada === '123') {
        usuarioLogado = { name: "Usuário 01", role: "Operador" };
    } else {
        erroMsg.style.display = 'block';
        return;
    }

    erroMsg.style.display = 'none';
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-panel').classList.remove('hidden');

    document.getElementById('nav-user-name').innerText = usuarioLogado.name;
    document.getElementById('nav-user-role').innerText = usuarioLogado.role;

    // Gerencia o que o Operador ou Admin podem ver
    aplicarPermissoesDeAcesso();

    renderizarTabela();
    alternarAba('dashboard');
}

function fazerLogout() {
    usuarioLogado = { name: "", role: "" };
    document.getElementById('login-form').reset();
    document.getElementById('main-panel').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function aplicarPermissoesDeAcesso() {
    const containerForm = document.getElementById('container-formulario-cadastro');
    const headerAcoes = document.getElementById('header-coluna-acoes');

    if (usuarioLogado.role === 'Operador') {
        if (containerForm) containerForm.classList.add('hidden');
        if (headerAcoes) headerAcoes.classList.add('hidden');
    } else {
        if (containerForm) containerForm.classList.remove('hidden');
        if (headerAcoes) headerAcoes.classList.remove('hidden');
    }
}

/* ==========================================================================
   SISTEMA DE ALTERNAÇÃO DE ABAS (NAVEGAÇÃO)
   ========================================================================== */
function alternarAba(abaSelecionada) {
    const secoes = {
        dashboard: document.getElementById('aba-dashboard'),
        estoque: document.getElementById('aba-estoque'),
        movimentacoes: document.getElementById('aba-movimentacoes')
    };
    const links = {
        dashboard: document.getElementById('link-dashboard'),
        estoque: document.getElementById('link-estoque'),
        movimentacoes: document.getElementById('link-movimentacoes')
    };

    Object.keys(secoes).forEach(chave => {
        if (secoes[chave]) secoes[chave].classList.add('hidden');
        if (links[chave]) links[chave].classList.remove('active');
    });

    if (secoes[abaSelecionada]) secoes[abaSelecionada].classList.remove('hidden');
    if (links[abaSelecionada]) links[abaSelecionada].classList.add('active');

    if (abaSelecionada === 'dashboard') {
        renderizarGrafico();
    } else if (abaSelecionada === 'movimentacoes') {
        atualizarSelectProdutos();
        renderizarHistorico();
    } else if (abaSelecionada === 'estoque') {
        renderizarTabela();
    }
}

/* ==========================================================================
   DASHBOARD: MATEMÁTICA E GRÁFICO REAL
   ========================================================================== */
function atualizarDashboardCards() {
    let totalItens = estoqueBanco.length;
    let volumeTotal = 0;
    let alertasCriticos = 0;

    estoqueBanco.forEach(item => {
        volumeTotal += item.qtd;
        if (item.qtd <= 15) {
            alertasCriticos++;
        }
    });

    document.getElementById('dash-total-itens').innerText = totalItens;
    document.getElementById('dash-volume-total').innerText = volumeTotal.toLocaleString('pt-BR');
    document.getElementById('dash-alertas').innerText = alertasCriticos;
}

function renderizarGrafico() {
    const ctx = document.getElementById('graficoEstoque');
    if (!ctx) return;

    if (meuGrafico) meuGrafico.destroy();

    const labelsProdutos = estoqueBanco.map(item => item.nome);
    const quantidadesProdutos = estoqueBanco.map(item => item.qtd);

    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelsProdutos,
            datasets: [{
                label: 'Quantidade em Estoque',
                data: quantidadesProdutos,
                backgroundColor: '#0284c7', 
                borderColor: '#0369a1',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

/* ==========================================================================
   LÓGICA DE MOVIMENTAÇÕES (ENTRADA / SAÍDA)
   ========================================================================== */
function atualizarSelectProdutos() {
    const select = document.getElementById('mov-produto');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Escolha o item...</option>';
    estoqueBanco.forEach((item, index) => {
        select.innerHTML += `<option value="${index}">[${item.codigo}] - ${item.nome} (Saldo atual: ${item.qtd})</option>`;
    });
}

function processarMovimentacao(event) {
    event.preventDefault();

    const produtoIndex = parseInt(document.getElementById('mov-produto').value);
    const tipo = document.getElementById('mov-tipo').value;
    const qtdMovimentada = parseFloat(document.getElementById('mov-qtd').value);
    
    const item = estoqueBanco[produtoIndex];

    if (tipo === "SAIDA" && item.qtd < qtdMovimentada) {
        alert(`❌ Erro Crítico: Saldo insuficiente! Você tentou dar saída de ${qtdMovimentada} unidades, mas o item "${item.nome}" possui apenas ${item.qtd} em estoque.`);
        return;
    }

    if (tipo === "ENTRADA") {
        item.qtd += qtdMovimentada;
    } else {
        item.qtd -= qtdMovimentada;
    }

    const novaMovimentacao = {
        dataHora: new Date().toLocaleString('pt-BR'),
        codigo: item.codigo,
        nome: item.nome,
        tipo: tipo,
        qtd: qtdMovimentada
    };

    historicoMovimentacoes.unshift(novaMovimentacao);

    localStorage.setItem('estoque_industrial', JSON.stringify(estoqueBanco));
    localStorage.setItem('historico_industrial', JSON.stringify(historicoMovimentacoes));

    atualizarSelectProdutos();
    renderizarHistorico();
    atualizarDashboardCards();
    document.getElementById('movimentacao-form').reset();
    
    alert(`✅ Operação de ${tipo} realizada com sucesso!`);
}

function renderizarHistorico() {
    const tbody = document.getElementById('movimentacoes-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (historicoMovimentacoes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8;">Nenhuma movimentação registrada até o momento.</td></tr>`;
        return;
    }

    historicoMovimentacoes.forEach(mov => {
        const classeTipo = mov.tipo === "ENTRADA" ? "badge-success" : "badge-danger";
        const sinal = mov.tipo === "ENTRADA" ? "+" : "-";

        tbody.innerHTML += `
            <tr>
                <td><small>${mov.dataHora}</small></td>
                <td><strong>${mov.codigo}</strong></td>
                <td>${mov.nome}</td>
                <td><span class="badge ${classeTipo}">${mov.tipo}</span></td>
                <td style="font-weight:bold; color: ${mov.tipo === "ENTRADA" ? "#065f46" : "#991b1b"}">${sinal} ${mov.qtd}</td>
            </tr>
        `;
    });
}

/* ==========================================================================
   FUNÇÕES DO CRUD DE SALDO EM ESTOQUE
   ========================================================================== */
function renderizarTabela() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    estoqueBanco.forEach((item, index) => {
        let statusBadge = '';
        if (item.qtd == 0) statusBadge = '<span class="badge badge-danger">Esgotado</span>';
        else if (item.qtd <= 15) statusBadge = '<span class="badge badge-warning">Estoque Baixo</span>';
        else statusBadge = '<span class="badge badge-success">Disponível</span>';

        let colActionsHTML = '';
        if (usuarioLogado.role === 'Admin') {
            colActionsHTML = `
                <td class="action-buttons">
                    <button class="btn-action btn-edit" onclick="prepararEdicao(${index})" title="Editar Item">✏️</button>
                    <button class="btn-action btn-delete" onclick="excluirItem(${index})" title="Excluir Item">🗑️</button>
                </td>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.codigo}</strong></td>
            <td>${item.nome}</td>
            <td>${item.categoria}</td>
            <td>${Number(item.qtd).toLocaleString('pt-BR')}</td>
            <td>${item.unidade}</td>
            <td>${statusBadge}</td>
            ${colActionsHTML}
        `;
        tbody.appendChild(tr);
    });

    atualizarDashboardCards();
}

function salvarItem(event) {
    event.preventDefault();

    const indexElement = document.getElementById('edit-index').value;
    let nomeDigitado = document.getElementById('item-nome').value.trim();
    let nomeFormatado = nomeDigitado.charAt(0).toUpperCase() + nomeDigitado.slice(1);

    const itemModificado = {
        codigo: document.getElementById('item-codigo').value.toUpperCase().trim(),
        nome: nomeFormatado,
        categoria: document.getElementById('item-categoria').value,
        qtd: parseFloat(document.getElementById('item-qtd').value),
        unidade: document.getElementById('item-unidade').value.toUpperCase().trim()
    };

    if (indexElement === "") {
        estoqueBanco.unshift(itemModificado);
    } else {
        estoqueBanco[parseInt(indexElement)] = itemModificado;
        cancelarEdicao();
    }

    localStorage.setItem('estoque_industrial', JSON.stringify(estoqueBanco));
    renderizarTabela();
    document.getElementById('product-form').reset();
}

function prepararEdicao(index) {
    const item = estoqueBanco[index];
    
    document.getElementById('edit-index').value = index;
    document.getElementById('item-codigo').value = item.codigo;
    document.getElementById('item-nome').value = item.nome;
    document.getElementById('item-categoria').value = item.categoria;
    document.getElementById('item-qtd').value = item.qtd;
    document.getElementById('item-unidade').value = item.unidade;

    document.getElementById('form-title').innerText = "✏️ Editando Item Cadastrado";
    document.getElementById('btn-submit').innerText = "Salvar Alterações";
    document.getElementById('btn-submit').style.backgroundColor = "#0284c7";
    document.getElementById('btn-cancel').classList.remove('hidden');
}

function cancelarEdicao() {
    document.getElementById('edit-index').value = "";
    document.getElementById('form-title').innerText = "➕ Cadastrar Novo Item no Estoque";
    document.getElementById('btn-submit').innerText = "Adicionar";
    document.getElementById('btn-submit').style.backgroundColor = "#10b981";
    document.getElementById('btn-cancel').classList.add('hidden');
    document.getElementById('product-form').reset();
}

function excluirItem(index) {
    if (confirm(`Tem certeza que deseja remover o item "${estoqueBanco[index].nome}" do estoque?`)) {
        estoqueBanco.splice(index, 1);
        localStorage.setItem('estoque_industrial', JSON.stringify(estoqueBanco));
        renderizarTabela();
        
        if (document.getElementById('edit-index').value == index) {
            cancelarEdicao();
        }
    }
}

function exportarParaCSV() {
    if (estoqueBanco.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    let csvContent = "\uFEFF"; 
    csvContent += "Codigo;Descricao;Categoria;Quantidade;Unidade\n";

    estoqueBanco.forEach(item => {
        csvContent += `${item.codigo};${item.nome};${item.categoria};${item.qtd};${item.unidade}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "banco_estoque_industrial.csv");
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link);
}