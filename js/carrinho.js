// Gerenciamento do Carrinho com localStorage
class CarrinhoManager {
    constructor() {
        this.carrinho = this.carregarCarrinho();
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }

    recarregarCarrinho() {
        this.carrinho = this.carregarCarrinho();
    }

    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
        this.atualizarBadge();
    }

    adicionarItem(itemId) {
        this.recarregarCarrinho(); // Garantir sincronização
        const item = cardapio.find(i => i.id === itemId);
        if (!item) return false;

        const itemExistente = this.carrinho.find(i => i.id === itemId);
        
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            this.carrinho.push({
                ...item,
                quantidade: 1
            });
        }
        
        this.salvarCarrinho();
        return true;
    }

    removerItem(itemId) {
        this.recarregarCarrinho(); // Garantir sincronização
        this.carrinho = this.carrinho.filter(item => item.id !== itemId);
        this.salvarCarrinho();
    }

    atualizarQuantidade(itemId, novaQuantidade) {
        this.recarregarCarrinho(); // Garantir sincronização
        if (novaQuantidade <= 0) {
            this.removerItem(itemId);
            return;
        }

        const item = this.carrinho.find(i => i.id === itemId);
        if (item) {
            item.quantidade = novaQuantidade;
            this.salvarCarrinho();
        }
    }

    obterTotal() {
        this.recarregarCarrinho(); // Garantir sincronização
        return this.carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    obterQuantidadeTotal() {
        this.recarregarCarrinho(); // Garantir sincronização
        return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
    }

    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
    }

    atualizarBadge() {
        const badges = document.querySelectorAll('#carrinho-badge');
        const quantidade = this.obterQuantidadeTotal();
        badges.forEach(badge => {
            badge.textContent = quantidade;
            badge.style.display = quantidade > 0 ? 'inline-block' : 'none';
        });
    }
}

// Instância global
const carrinhoManager = new CarrinhoManager();

// Atualizar badge ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    carrinhoManager.atualizarBadge();
});
