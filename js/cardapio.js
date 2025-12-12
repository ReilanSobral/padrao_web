// Carregar cardápio na página
document.addEventListener('DOMContentLoaded', function() {
    const cardapioGrid = document.getElementById('cardapio-grid');
    if (!cardapioGrid) return;
    
    cardapio.forEach(item => {
        const cardapioItem = document.createElement('div');
        cardapioItem.className = 'cardapio-item';
        
        cardapioItem.innerHTML = `
            <div class="cardapio-imagem">${item.imagem}</div>
            <h3>${item.nome}</h3>
            <p class="descricao">${item.descricao}</p>
            <div class="cardapio-footer">
                <p class="preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                <button class="add-btn" onclick="adicionarAoCarrinho(${item.id})">Adicionar</button>
            </div>
        `;
        
        cardapioGrid.appendChild(cardapioItem);
    });
});

function adicionarAoCarrinho(itemId) {
    const sucesso = carrinhoManager.adicionarItem(itemId);
    
    if (sucesso) {
        // Feedback visual
        const cardapioItem = document.querySelector(`[onclick="adicionarAoCarrinho(${itemId})"]`).closest('.cardapio-item');
        cardapioItem.classList.add('selected');
        setTimeout(() => {
            cardapioItem.classList.remove('selected');
        }, 500);
    }
}

