// Página do Carrinho
let formularioConfigurado = false;

document.addEventListener('DOMContentLoaded', function() {
    atualizarCarrinho();
    configurarMascaras();
    configurarPagamento();
    configurarFormulario();
});

function atualizarCarrinho() {
    // Recarregar do localStorage para garantir sincronização
    carrinhoManager.recarregarCarrinho();
    const carrinho = carrinhoManager.carrinho;
    
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoContent = document.getElementById('carrinho-content');
    const carrinhoLista = document.getElementById('carrinho-lista');
    
    if (!carrinhoVazio || !carrinhoContent || !carrinhoLista) {
        return;
    }
    
    if (carrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
        carrinhoContent.style.display = 'none';
        return;
    }
    
    carrinhoVazio.style.display = 'none';
    carrinhoContent.style.display = 'block';
    
    carrinhoLista.innerHTML = carrinho.map(item => `
        <div class="carrinho-item">
            <div class="item-info">
                <h4>${item.nome}</h4>
                <p class="item-descricao">${item.descricao}</p>
            </div>
            <div class="item-controles">
                <div class="quantidade-controle">
                    <button onclick="diminuirQuantidade(${item.id})" class="qty-btn">-</button>
                    <span class="qty-value">${item.quantidade}</span>
                    <button onclick="aumentarQuantidade(${item.id})" class="qty-btn">+</button>
                </div>
                <div class="item-preco">
                    <strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong>
                </div>
                <button onclick="removerItem(${item.id})" class="btn-remover">Remover</button>
            </div>
        </div>
    `).join('');
    
    atualizarTotais();
}

function diminuirQuantidade(itemId) {
    carrinhoManager.atualizarQuantidade(itemId, carrinhoManager.carrinho.find(i => i.id === itemId)?.quantidade - 1 || 0);
    atualizarCarrinho();
}

function aumentarQuantidade(itemId) {
    carrinhoManager.atualizarQuantidade(itemId, (carrinhoManager.carrinho.find(i => i.id === itemId)?.quantidade || 0) + 1);
    atualizarCarrinho();
}

function removerItem(itemId) {
    carrinhoManager.removerItem(itemId);
    atualizarCarrinho();
}

function atualizarTotais() {
    const subtotal = carrinhoManager.obterTotal();
    const taxaEntrega = 5.00;
    const total = subtotal + taxaEntrega;
    
    const subtotalEl = document.getElementById('subtotal');
    const resumoSubtotalEl = document.getElementById('resumo-subtotal');
    const resumoTotalEl = document.getElementById('resumo-total');
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',');
    if (resumoSubtotalEl) resumoSubtotalEl.textContent = subtotal.toFixed(2).replace('.', ',');
    if (resumoTotalEl) resumoTotalEl.textContent = total.toFixed(2).replace('.', ',');
}

function configurarMascaras() {
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }
    
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
                e.target.value = value;
                
                if (value.replace(/\D/g, '').length === 8) {
                    buscarCEP(value.replace(/\D/g, ''));
                }
            }
        });
    }
}

async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            mostrarErroCEP('CEP não encontrado');
            return;
        }
        
        const enderecoInput = document.getElementById('endereco');
        const bairroInput = document.getElementById('bairro');
        const cidadeInput = document.getElementById('cidade');
        
        if (enderecoInput) enderecoInput.value = data.logradouro || '';
        if (bairroInput) bairroInput.value = data.bairro || '';
        if (cidadeInput) cidadeInput.value = data.localidade || '';
        
        limparErroCEP();
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        mostrarErroCEP('Erro ao buscar CEP. Tente novamente.');
    }
}

function mostrarErroCEP(mensagem) {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;
    
    let erroElement = document.querySelector('.cep-erro');
    
    if (!erroElement) {
        erroElement = document.createElement('small');
        erroElement.className = 'cep-erro';
        erroElement.style.color = 'red';
        erroElement.style.display = 'block';
        erroElement.style.marginTop = '0.25rem';
        cepInput.parentNode.appendChild(erroElement);
    }
    
    erroElement.textContent = mensagem;
}

function limparErroCEP() {
    const erroElement = document.querySelector('.cep-erro');
    if (erroElement) {
        erroElement.remove();
    }
}

function configurarPagamento() {
    const pagamentoSelect = document.getElementById('pagamento');
    const trocoContainer = document.getElementById('troco-container');
    const trocoInput = document.getElementById('troco');
    
    if (pagamentoSelect) {
        pagamentoSelect.addEventListener('change', function() {
            if (this.value === 'dinheiro') {
                if (trocoContainer) trocoContainer.style.display = 'block';
                if (trocoInput) trocoInput.required = true;
            } else {
                if (trocoContainer) trocoContainer.style.display = 'none';
                if (trocoInput) {
                    trocoInput.required = false;
                    trocoInput.value = '';
                }
            }
        });
    }
}

function configurarFormulario() {
    // Evitar múltiplos listeners
    if (formularioConfigurado) {
        return;
    }
    
    formularioConfigurado = true;
    
    // Listener direto no botão
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            finalizarPedido();
        });
    }
}

function finalizarPedido() {
    // Recarregar carrinho do localStorage antes de verificar
    carrinhoManager.recarregarCarrinho();
    const carrinho = carrinhoManager.carrinho;
    
    console.log('Finalizando pedido...');
    console.log('Itens no carrinho:', carrinho.length);
    console.log('Carrinho:', carrinho);
    
    // Verificar se há itens no carrinho
    if (!carrinho || carrinho.length === 0) {
        alert('Seu carrinho está vazio! Adicione itens antes de finalizar.');
        window.location.href = 'cardapio.html';
        return;
    }
    
    // Obter elementos do formulário
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const numeroInput = document.getElementById('numero');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const pagamentoSelect = document.getElementById('pagamento');
    const trocoInput = document.getElementById('troco');
    const observacoesInput = document.getElementById('observacoes');
    
    // Validações
    if (!nomeInput || !nomeInput.value.trim()) {
        alert('Por favor, preencha seu nome');
        if (nomeInput) nomeInput.focus();
        return;
    }
    
    if (!emailInput || !emailInput.value.trim()) {
        alert('Por favor, preencha seu email');
        if (emailInput) emailInput.focus();
        return;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        alert('Por favor, insira um email válido');
        emailInput.focus();
        return;
    }
    
    if (!telefoneInput || !telefoneInput.value.trim()) {
        alert('Por favor, preencha seu telefone');
        if (telefoneInput) telefoneInput.focus();
        return;
    }
    
    if (!cepInput || !cepInput.value.trim()) {
        alert('Por favor, preencha o CEP');
        if (cepInput) cepInput.focus();
        return;
    }
    
    if (!enderecoInput || !enderecoInput.value.trim()) {
        alert('Por favor, preencha o endereço');
        if (enderecoInput) enderecoInput.focus();
        return;
    }
    
    if (!numeroInput || !numeroInput.value.trim()) {
        alert('Por favor, preencha o número');
        if (numeroInput) numeroInput.focus();
        return;
    }
    
    if (!bairroInput || !bairroInput.value.trim()) {
        alert('Por favor, preencha o bairro');
        if (bairroInput) bairroInput.focus();
        return;
    }
    
    if (!cidadeInput || !cidadeInput.value.trim()) {
        alert('Por favor, preencha a cidade');
        if (cidadeInput) cidadeInput.focus();
        return;
    }
    
    if (!pagamentoSelect || !pagamentoSelect.value) {
        alert('Por favor, selecione a forma de pagamento');
        if (pagamentoSelect) pagamentoSelect.focus();
        return;
    }
    
    if (pagamentoSelect.value === 'dinheiro') {
        if (!trocoInput || !trocoInput.value.trim()) {
            alert('Por favor, informe se precisa de troco (digite o valor ou "0" se não precisar)');
            if (trocoInput) trocoInput.focus();
            return;
        }
    }
    
    // Gerar número do pedido
    const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
    
    // Coletar dados - usar carrinho atualizado
    const dadosPedido = {
        numeroPedido: numeroPedido,
        data: new Date().toISOString(),
        nome: nomeInput.value.trim(),
        email: emailInput.value.trim(),
        telefone: telefoneInput.value.trim(),
        cep: cepInput.value.trim(),
        endereco: enderecoInput.value.trim(),
        numero: numeroInput.value.trim(),
        complemento: (document.getElementById('complemento')?.value || '').trim(),
        bairro: bairroInput.value.trim(),
        cidade: cidadeInput.value.trim(),
        pagamento: pagamentoSelect.value,
        troco: pagamentoSelect.value === 'dinheiro' ? trocoInput.value.trim() : null,
        observacoes: (observacoesInput?.value || '').trim(),
        itens: JSON.parse(JSON.stringify(carrinho)), // Usar carrinho recarregado
        subtotal: carrinhoManager.obterTotal(),
        taxaEntrega: 5.00,
        total: carrinhoManager.obterTotal() + 5.00
    };
    
    try {
        // Salvar pedido no localStorage para exibir na página de confirmação
        localStorage.setItem('pedidoConfirmado', JSON.stringify(dadosPedido));
        
        // Limpar carrinho
        carrinhoManager.limparCarrinho();
        
        // Redirecionar para página de confirmação
        window.location.href = 'pedido-confirmado.html';
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        alert('Erro ao finalizar pedido. Por favor, tente novamente.');
    }
}
