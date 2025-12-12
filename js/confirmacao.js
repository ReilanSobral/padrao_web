// Página de Confirmação do Pedido
document.addEventListener('DOMContentLoaded', function() {
    const pedidoSalvo = localStorage.getItem('pedidoConfirmado');
    
    if (!pedidoSalvo) {
        // Se não houver pedido salvo, redirecionar para o carrinho
        window.location.href = 'carrinho.html';
        return;
    }
    
    const pedido = JSON.parse(pedidoSalvo);
    exibirPedido(pedido);
});

function exibirPedido(pedido) {
    // Número do pedido
    document.getElementById('numero-pedido').textContent = `#${pedido.numeroPedido}`;
    
    // Previsão de entrega
    const agora = new Date();
    const previsao = new Date(agora.getTime() + 40 * 60000); // 40 minutos
    const hora = previsao.getHours().toString().padStart(2, '0');
    const minuto = previsao.getMinutes().toString().padStart(2, '0');
    document.getElementById('previsao-entrega').textContent = `${hora}:${minuto} (30-45 min)`;
    
    // Dados de entrega
    const dadosEntrega = `
        <p><strong>Nome:</strong> ${pedido.nome}</p>
        <p><strong>Telefone:</strong> ${pedido.telefone}</p>
        <p><strong>Email:</strong> ${pedido.email}</p>
        <p><strong>Endereço:</strong> ${pedido.endereco}, ${pedido.numero}${pedido.complemento ? ' - ' + pedido.complemento : ''}</p>
        <p><strong>Bairro:</strong> ${pedido.bairro}</p>
        <p><strong>Cidade:</strong> ${pedido.cidade} - CEP: ${pedido.cep}</p>
    `;
    document.getElementById('dados-entrega').innerHTML = dadosEntrega;
    
    // Itens do pedido
    const itensHTML = pedido.itens.map(item => `
        <div class="item-confirmacao">
            <div class="item-confirmacao-info">
                <h4>${item.nome}</h4>
                <p>${item.descricao}</p>
            </div>
            <div class="item-confirmacao-qty">
                <span>${item.quantidade}x</span>
            </div>
            <div class="item-confirmacao-preco">
                <strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong>
            </div>
        </div>
    `).join('');
    document.getElementById('itens-pedido').innerHTML = itensHTML;
    
    // Forma de pagamento
    const formasPagamento = {
        'dinheiro': 'Dinheiro',
        'cartao-debito': 'Cartão de Débito',
        'cartao-credito': 'Cartão de Crédito',
        'pix': 'PIX'
    };
    
    let pagamentoHTML = `<p><strong>Forma de Pagamento:</strong> ${formasPagamento[pedido.pagamento] || pedido.pagamento}</p>`;
    
    if (pedido.pagamento === 'dinheiro' && pedido.troco) {
        pagamentoHTML += `<p><strong>Troco para:</strong> R$ ${parseFloat(pedido.troco.replace(',', '.')).toFixed(2).replace('.', ',')}</p>`;
    }
    
    document.getElementById('pagamento-info').innerHTML = pagamentoHTML;
    
    // Totais
    document.getElementById('resumo-subtotal').textContent = pedido.subtotal.toFixed(2).replace('.', ',');
    document.getElementById('resumo-taxa').textContent = pedido.taxaEntrega.toFixed(2).replace('.', ',');
    document.getElementById('resumo-total').textContent = pedido.total.toFixed(2).replace('.', ',');
    
    // Limpar pedido do localStorage após exibir
    // (mantém por enquanto para permitir visualização)
}

